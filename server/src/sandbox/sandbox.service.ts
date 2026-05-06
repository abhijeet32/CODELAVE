import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { UsageService } from '../usage/usage.service';
import { SandboxResponseDto } from './dto/sandbox.dto';

@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);
  // In-memory map of sandbox timeouts
  private readonly timeoutTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
    private readonly usageService: UsageService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new sandbox (Docker container on sandbox host).
   */
  async createSandbox(
    userId: string,
    templateName?: string,
    timeoutSeconds?: number,
  ): Promise<SandboxResponseDto> {
    // 1. Check free tier limits
    await this.usageService.checkSandboxLimit(userId);

    // 2. Resolve template
    const template = await this.resolveTemplate(templateName || 'python3');
    const defaultTimeout = this.configService.get<number>(
      'SANDBOX_DEFAULT_TIMEOUT_SECONDS',
      300,
    );
    const timeout = timeoutSeconds || defaultTimeout;
    const timeoutAt = new Date(Date.now() + timeout * 1000);

    // 3. Create sandbox record in database
    const sandbox = await this.prisma.sandbox.create({
      data: {
        userId,
        status: 'CREATING',
        templateId: template?.id || null,
        timeoutAt,
      },
    });

    try {
      // 4. Create Docker container on sandbox host
      const containerId = await this.dockerService.createContainer({
        sandboxId: sandbox.id,
        image: template?.dockerImage || 'ghcr.io/abhijeet32/codelave/sandbox-image:dev',
        memoryLimit: this.configService.get<string>(
          'SANDBOX_MEMORY_LIMIT',
          '256m',
        ),
        cpuLimit: this.configService.get<string>('SANDBOX_CPU_LIMIT', '0.5'),
        pidLimit: this.configService.get<number>('SANDBOX_PID_LIMIT', 64),
        networkMode: template?.hasInternet ? 'bridge' : 'none',
      });

      // 5. Update sandbox with container ID and status
      const updated = await this.prisma.sandbox.update({
        where: { id: sandbox.id },
        data: {
          containerId,
          status: 'RUNNING',
        },
        include: { template: true },
      });

      // 6. Start timeout timer
      this.startTimeoutTimer(sandbox.id, timeout);

      // 7. Increment usage
      await this.usageService.incrementSandboxCount(userId);

      this.logger.log(
        `Sandbox created: ${sandbox.id} (container: ${containerId})`,
      );

      return this.toResponse(updated);
    } catch (error) {
      // If Docker fails, mark sandbox as error
      await this.prisma.sandbox.update({
        where: { id: sandbox.id },
        data: { status: 'ERROR' },
      });
      throw error;
    }
  }

  /**
   * Get a single sandbox by ID (with ownership check).
   */
  async getSandbox(
    userId: string,
    sandboxId: string,
  ): Promise<SandboxResponseDto> {
    const sandbox = await this.prisma.sandbox.findUnique({
      where: { id: sandboxId },
      include: { template: true },
    });

    if (!sandbox) {
      throw new NotFoundException('Sandbox not found');
    }

    if (sandbox.userId !== userId) {
      throw new ForbiddenException('Access denied to this sandbox');
    }

    return this.toResponse(sandbox);
  }

  /**
   * List all sandboxes for a user.
   */
  async listSandboxes(userId: string): Promise<SandboxResponseDto[]> {
    const sandboxes = await this.prisma.sandbox.findMany({
      where: { userId },
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });

    return sandboxes.map((s) => this.toResponse(s));
  }

  /**
   * Destroy a sandbox (stop container, update DB).
   */
  async destroySandbox(userId: string, sandboxId: string): Promise<void> {
    const sandbox = await this.prisma.sandbox.findUnique({
      where: { id: sandboxId },
    });

    if (!sandbox) {
      throw new NotFoundException('Sandbox not found');
    }

    if (sandbox.userId !== userId) {
      throw new ForbiddenException('Access denied to this sandbox');
    }

    if (sandbox.status === 'DESTROYED') {
      throw new BadRequestException('Sandbox is already destroyed');
    }

    // Destroy Docker container
    if (sandbox.containerId) {
      await this.dockerService.destroyContainer(sandbox.containerId);
    }

    // Update database
    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: {
        status: 'DESTROYED',
        destroyedAt: new Date(),
      },
    });

    // Cancel timeout timer
    this.cancelTimeoutTimer(sandboxId);

    this.logger.log(`Sandbox destroyed: ${sandboxId}`);
  }

  /**
   * Internal method to destroy a sandbox by ID (for lifecycle cleanup).
   */
  async destroySandboxInternal(sandboxId: string): Promise<void> {
    const sandbox = await this.prisma.sandbox.findUnique({
      where: { id: sandboxId },
    });

    if (!sandbox || sandbox.status === 'DESTROYED') {
      return;
    }

    if (sandbox.containerId) {
      await this.dockerService.destroyContainer(sandbox.containerId);
    }

    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: {
        status: 'DESTROYED',
        destroyedAt: new Date(),
      },
    });

    this.cancelTimeoutTimer(sandboxId);

    this.logger.log(`Sandbox auto-destroyed: ${sandboxId}`);
  }

  /**
   * Validate that a sandbox exists, is running, and belongs to the user.
   * Returns the sandbox record.
   */
  async validateRunningSandbox(userId: string, sandboxId: string) {
    const sandbox = await this.prisma.sandbox.findUnique({
      where: { id: sandboxId },
    });

    if (!sandbox) {
      throw new NotFoundException('Sandbox not found');
    }

    if (sandbox.userId !== userId) {
      throw new ForbiddenException('Access denied to this sandbox');
    }

    if (sandbox.status !== 'RUNNING') {
      throw new BadRequestException(
        `Sandbox is not running (status: ${sandbox.status})`,
      );
    }

    if (!sandbox.containerId) {
      throw new BadRequestException('Sandbox has no container assigned');
    }

    return sandbox;
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────

  private startTimeoutTimer(sandboxId: string, timeoutSeconds: number): void {
    const timer = setTimeout(async () => {
      this.logger.log(`Sandbox timeout reached: ${sandboxId}`);
      try {
        await this.destroySandboxInternal(sandboxId);
      } catch (error: any) {
        this.logger.error(
          `Failed to auto-destroy sandbox ${sandboxId}: ${error.message}`,
        );
      }
    }, timeoutSeconds * 1000);

    this.timeoutTimers.set(sandboxId, timer);
  }

  private cancelTimeoutTimer(sandboxId: string): void {
    const timer = this.timeoutTimers.get(sandboxId);
    if (timer) {
      clearTimeout(timer);
      this.timeoutTimers.delete(sandboxId);
    }
  }

  private async resolveTemplate(name: string) {
    // Try to find template in database
    const template = await this.prisma.template.findUnique({
      where: { name },
    });

    // If no template exists, return a default config
    if (!template) {
      this.logger.warn(`Template "${name}" not found, using default image`);
      return null;
    }

    return template;
  }

  private toResponse(sandbox: any): SandboxResponseDto {
    return {
      id: sandbox.id,
      status: sandbox.status,
      template: sandbox.template?.name || sandbox.templateId || null,
      createdAt: sandbox.createdAt,
      timeoutAt: sandbox.timeoutAt,
      destroyedAt: sandbox.destroyedAt || null,
    };
  }
}
