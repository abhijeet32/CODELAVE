import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Docker from 'dockerode';
import { Readable, PassThrough } from 'stream';

export interface ContainerConfig {
  sandboxId: string;
  image: string;
  memoryLimit: string;
  cpuLimit: string;
  pidLimit: number;
  networkMode: string;
}

export interface ExecResult {
  output: string;
  error: string;
  exitCode: number;
}

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
  private docker: Docker;

  constructor(private readonly configService: ConfigService) {
    const dockerHost = this.configService.get<string>('DOCKER_HOST', '/var/run/docker.sock');
    
    if (dockerHost.startsWith('/') || dockerHost.startsWith('unix://')) {
      const socketPath = dockerHost.replace('unix://', '');
      this.docker = new Docker({ socketPath });
      this.logger.log(`Docker client configured for socket: ${socketPath}`);
    } else {
      try {
        const parsed = new URL(dockerHost);
        this.docker = new Docker({
          host: parsed.hostname,
          port: parseInt(parsed.port || '2376', 10),
          protocol: parsed.protocol === 'https:' ? 'https' : 'http',
        });
        this.logger.log(`Docker client configured for host: ${dockerHost}`);
      } catch (error) {
        this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
        this.logger.log(`Docker client configured for local socket (fallback): /var/run/docker.sock`);
      }
    }
  }

  /**
   * Create a new container with security constraints.
   */
  async createContainer(config: ContainerConfig): Promise<string> {
    try {
      // Parse memory limit (e.g., "256m" → bytes)
      const memoryBytes = this.parseMemoryLimit(config.memoryLimit);
      const cpuNanoCpus = Math.floor(parseFloat(config.cpuLimit) * 1e9);

      // Auto-pull image if it doesn't exist locally (useful for AWS/production)
      try {
        const images = await this.docker.listImages({ filters: { reference: [config.image] } });
        if (images.length === 0) {
          this.logger.log(`Image ${config.image} not found locally, pulling...`);
          await new Promise<void>((resolve, reject) => {
            this.docker.pull(config.image, (err: Error | null, stream: any) => {
              if (err) return reject(err);
              this.docker.modem.followProgress(stream, (onFinishedErr: Error | null) => {
                if (onFinishedErr) return reject(onFinishedErr);
                resolve();
              });
            });
          });
          this.logger.log(`Successfully pulled image ${config.image}`);
        }
      } catch (err: any) {
        this.logger.warn(`Failed to auto-pull image ${config.image}: ${err.message}`);
      }

      const container = await this.docker.createContainer({
        Image: config.image,
        name: `codelave-sandbox-${config.sandboxId}`,
        Tty: true,
        OpenStdin: true,
        // Run as the user defined in the image
        // User: '1000',
        HostConfig: {
          Memory: memoryBytes,
          NanoCpus: cpuNanoCpus,
          PidsLimit: Number(config.pidLimit),
          NetworkMode: config.networkMode,
          // Read-only root filesystem
          ReadonlyRootfs: false, // Some templates need write access to /tmp
          // Security options
          SecurityOpt: ['no-new-privileges'],
          // Tmpfs for writable directories
          Tmpfs: {
            '/tmp': 'rw,noexec,nosuid,size=64m',
            '/sandbox': 'rw,noexec,nosuid,uid=1000,gid=1000,size=128m',
          },
          // Drop all capabilities, add only what's needed
          CapDrop: ['ALL'],
          CapAdd: ['SETUID', 'SETGID'],
        },
        WorkingDir: '/sandbox',
        Cmd: ['tail', '-f', '/dev/null'], // Universally keep container alive across Node, Python, and Ubuntu
      });

      await container.start();

      this.logger.log(
        `Container created: ${container.id} for sandbox ${config.sandboxId}`,
      );
      return container.id;
    } catch (error: any) {
      this.handleDockerError(error, 'createContainer');
      throw error; // TypeScript requires this
    }
  }

  /**
   * Execute code inside a running container.
   */
  async executeCode(
    containerId: string,
    code: string,
    language: string = 'python',
    timeoutMs: number = 30000,
  ): Promise<ExecResult> {
    try {
      const container = this.docker.getContainer(containerId);

      // Build the execution command based on language
      const cmd = this.buildExecCommand(code, language);

      const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
        User: '1000',
      });

      return new Promise<ExecResult>((resolve, reject) => {
        const timeout = setTimeout(() => {
          // Kill the exec process on timeout
          this.killExec(container, exec).catch(() => {});
          resolve({
            output: '',
            error: 'Execution timed out after ' + timeoutMs / 1000 + ' seconds',
            exitCode: 124,
          });
        }, timeoutMs);

        exec.start(
          { hijack: true, stdin: false },
          (err: Error | null, stream: any) => {
            if (err) {
              clearTimeout(timeout);
              reject(this.translateDockerError(err));
              return;
            }

            let stdout = '';
            let stderr = '';

            const stdoutStream = new PassThrough();
            const stderrStream = new PassThrough();

            // Demux the multiplexed stream
            this.docker.modem.demuxStream(stream, stdoutStream, stderrStream);

            stdoutStream.on('data', (chunk: Buffer) => {
              stdout += chunk.toString();
            });

            stderrStream.on('data', (chunk: Buffer) => {
              stderr += chunk.toString();
            });

            stream.on('end', () => {
              clearTimeout(timeout);
              exec.inspect((inspectErr: Error | null, data: any) => {
                if (inspectErr) {
                  resolve({ output: stdout, error: stderr, exitCode: -1 });
                } else {
                  resolve({
                    output: stdout,
                    error: stderr,
                    exitCode: data.ExitCode ?? -1,
                  });
                }
              });
            });

            stream.on('error', (streamErr: Error) => {
              clearTimeout(timeout);
              reject(this.translateDockerError(streamErr));
            });
          },
        );
      });
    } catch (error: any) {
      this.handleDockerError(error, 'executeCode');
      throw error;
    }
  }

  /**
   * Execute code with real-time streaming output.
   * Calls onData for each chunk, onDone when complete, onError on failure.
   */
  async executeCodeStreaming(
    containerId: string,
    code: string,
    language: string,
    timeoutMs: number,
    callbacks: {
      onData: (chunk: string, isStderr: boolean) => void;
      onDone: (exitCode: number) => void;
      onError: (error: string) => void;
    },
  ): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      const cmd = this.buildExecCommand(code, language);

      const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
        User: '1000',
      });

      exec.start(
        { hijack: true, stdin: false },
        (err: Error | null, stream: any) => {
          if (err) {
            callbacks.onError(this.translateDockerError(err).message);
            return;
          }

          const timeout = setTimeout(() => {
            this.killExec(container, exec).catch(() => {});
            callbacks.onError(
              `Execution timed out after ${timeoutMs / 1000} seconds`,
            );
          }, timeoutMs);

          const stdoutStream = new PassThrough();
          const stderrStream = new PassThrough();

          this.docker.modem.demuxStream(stream, stdoutStream, stderrStream);

          stdoutStream.on('data', (chunk: Buffer) => {
            callbacks.onData(chunk.toString(), false);
          });

          stderrStream.on('data', (chunk: Buffer) => {
            callbacks.onData(chunk.toString(), true);
          });

          stream.on('end', () => {
            clearTimeout(timeout);
            exec.inspect((inspectErr: Error | null, data: any) => {
              callbacks.onDone(inspectErr ? -1 : (data.ExitCode ?? -1));
            });
          });

          stream.on('error', (streamErr: Error) => {
            clearTimeout(timeout);
            callbacks.onError(streamErr.message);
          });
        },
      );
    } catch (error: any) {
      callbacks.onError(this.translateDockerError(error).message);
    }
  }

  /**
   * Stop and remove a container.
   */
  async destroyContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);

      try {
        await container.stop({ t: 5 });
      } catch (error: any) {
        // Container already stopped is fine
        if (error.statusCode !== 304 && error.statusCode !== 404) {
          throw error;
        }
      }

      try {
        await container.remove({ force: true });
      } catch (error: any) {
        if (error.statusCode !== 404) {
          throw error;
        }
      }

      this.logger.log(`Container destroyed: ${containerId}`);
    } catch (error: any) {
      this.handleDockerError(error, 'destroyContainer');
    }
  }

  /**
   * Copy a file into a container.
   */
  async copyFileToContainer(
    containerId: string,
    fileBuffer: Buffer,
    fileName: string,
    destPath: string = '/sandbox',
  ): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);

      // Create a tar archive containing the file
      const tar = await this.createTarBuffer(fileName, fileBuffer);

      await container.putArchive(tar, { path: destPath });

      this.logger.log(`File ${fileName} copied to container ${containerId}`);
    } catch (error: any) {
      this.handleDockerError(error, 'copyFileToContainer');
    }
  }

  /**
   * Get a file from a container.
   */
  async getFileFromContainer(
    containerId: string,
    filePath: string,
  ): Promise<Readable> {
    try {
      const container = this.docker.getContainer(containerId);
      const stream = await container.getArchive({ path: filePath });
      return stream as unknown as Readable;
    } catch (error: any) {
      this.handleDockerError(error, 'getFileFromContainer');
      throw error;
    }
  }

  /**
   * Check if a container exists and is running.
   */
  async getContainerStatus(containerId: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);
      const info = await container.inspect();
      return info.State.Status;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return 'not_found';
      }
      this.handleDockerError(error, 'getContainerStatus');
      throw error;
    }
  }

  /**
   * List all codelave containers (for orphan cleanup).
   */
  async listCodelaveContainers(): Promise<string[]> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: { name: ['codelave-sandbox-'] },
      });
      return containers.map((c) => c.Id);
    } catch (error: any) {
      this.handleDockerError(error, 'listCodelaveContainers');
      return [];
    }
  }

  /**
   * Check Docker daemon connectivity.
   */
  async ping(): Promise<boolean> {
    try {
      await this.docker.ping();
      return true;
    } catch {
      return false;
    }
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────────

  private buildExecCommand(code: string, language: string): string[] {
    // Escape the code for shell safety
    const escapedCode = code.replace(/'/g, "'\\''");

    switch (language.toLowerCase()) {
      case 'python':
      case 'python3':
        return ['python3', '-c', code];
      case 'javascript':
      case 'node':
      case 'js':
        return ['node', '-e', code];
      case 'bash':
      case 'sh':
      case 'shell':
        return ['sh', '-c', code];
      case 'ruby':
        return ['ruby', '-e', code];
      case 'php':
        return ['php', '-r', code];
      default:
        // Default: try to run as shell command
        return ['sh', '-c', code];
    }
  }

  private async killExec(
    container: Docker.Container,
    exec: Docker.Exec,
  ): Promise<void> {
    try {
      // Send SIGKILL to the exec process
      const info = await exec.inspect();
      if (info.Running) {
        // Use top to find and kill the process
        await container.exec({
          Cmd: ['kill', '-9', String(info.Pid)],
        });
      }
    } catch {
      // Best effort
    }
  }

  private parseMemoryLimit(limit: string): number {
    const match = limit.match(/^(\d+)([kmg]?)$/i);
    if (!match) return 256 * 1024 * 1024; // Default 256MB

    const value = parseInt(match[1], 10);
    const unit = (match[2] || 'm').toLowerCase();

    switch (unit) {
      case 'k':
        return value * 1024;
      case 'm':
        return value * 1024 * 1024;
      case 'g':
        return value * 1024 * 1024 * 1024;
      default:
        return value * 1024 * 1024;
    }
  }

  private async createTarBuffer(
    fileName: string,
    content: Buffer,
  ): Promise<Buffer> {
    // Simple tar implementation for single file
    const header = Buffer.alloc(512);

    // File name (max 100 chars)
    header.write(fileName.substring(0, 100), 0, 100, 'utf-8');

    // File mode (0644)
    header.write('0000644\0', 100, 8, 'utf-8');

    // Owner/Group UID/GID (1000)
    header.write('0001750\0', 108, 8, 'utf-8');
    header.write('0001750\0', 116, 8, 'utf-8');

    // File size (octal)
    const sizeStr = content.length.toString(8).padStart(11, '0') + '\0';
    header.write(sizeStr, 124, 12, 'utf-8');

    // Modification time
    const mtime =
      Math.floor(Date.now() / 1000)
        .toString(8)
        .padStart(11, '0') + '\0';
    header.write(mtime, 136, 12, 'utf-8');

    // Checksum placeholder
    header.write('        ', 148, 8, 'utf-8');

    // Type flag (regular file)
    header.write('0', 156, 1, 'utf-8');

    // USTAR indicator
    header.write('ustar\0', 257, 6, 'utf-8');
    header.write('00', 263, 2, 'utf-8');

    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.write(checksumStr, 148, 8, 'utf-8');

    // Pad content to 512-byte boundary
    const padding = 512 - (content.length % 512);
    const paddingBuffer =
      padding < 512 ? Buffer.alloc(padding) : Buffer.alloc(0);

    // End-of-archive marker (two 512-byte zero blocks)
    const endMarker = Buffer.alloc(1024);

    return Buffer.concat([header, content, paddingBuffer, endMarker]);
  }

  private handleDockerError(error: any, operation: string): never {
    const message = error.message || 'Unknown Docker error';
    const statusCode = error.statusCode;

    this.logger.error(`Docker ${operation} failed: ${message}`, {
      operation,
      statusCode,
    });

    if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
      throw new ServiceUnavailableException(
        'Sandbox host is unreachable. Please try again later.',
      );
    }

    if (statusCode === 404) {
      throw new NotFoundException('Container not found');
    }

    if (statusCode === 304) {
      // Container already stopped — this is usually fine
      return undefined as never;
    }

    if (statusCode === 409) {
      throw new InternalServerErrorException(
        'Container conflict. It may already exist or be in use.',
      );
    }

    throw new InternalServerErrorException(
      `Sandbox operation failed: ${this.sanitizeErrorMessage(message)}`,
    );
  }

  private translateDockerError(error: any): Error {
    const message = error.message || 'Unknown error';

    if (message.includes('ECONNREFUSED')) {
      return new ServiceUnavailableException('Sandbox host is unreachable');
    }

    if (message.includes('No such container')) {
      return new NotFoundException('Container not found');
    }

    return new InternalServerErrorException(
      `Execution error: ${this.sanitizeErrorMessage(message)}`,
    );
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove any potential sensitive information from Docker error messages
    return message
      .replace(/\/var\/run\/docker\.sock/g, '[docker]')
      .replace(/tcp:\/\/[^:]+:\d+/g, '[docker-host]')
      .substring(0, 200);
  }
}
