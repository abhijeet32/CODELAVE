import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { UsageService } from '../usage/usage.service';
import { SandboxService } from '../sandbox/sandbox.service';
import { ExecutionResponseDto } from './dto/execution.dto';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);
  private readonly EXECUTION_TIMEOUT_MS = 30000; // 30 seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
    private readonly usageService: UsageService,
    private readonly sandboxService: SandboxService,
  ) {}

  /**
   * Execute code inside a sandbox (synchronous — returns full output).
   */
  async executeCode(
    userId: string,
    sandboxId: string,
    code: string,
    language: string = 'python',
  ): Promise<ExecutionResponseDto> {
    // 1. Validate sandbox ownership and status
    const sandbox = await this.sandboxService.validateRunningSandbox(userId, sandboxId);

    // 2. Check execution limit
    await this.usageService.checkExecutionLimit(userId);

    // 3. Create execution record
    const execution = await this.prisma.execution.create({
      data: {
        sandboxId,
        code,
        startedAt: new Date(),
      },
    });

    const startTime = Date.now();

    try {
      // 4. Execute code in container
      const result = await this.dockerService.executeCode(
        sandbox.containerId!,
        code,
        language,
        this.EXECUTION_TIMEOUT_MS,
      );

      const durationMs = Date.now() - startTime;
      const finishedAt = new Date();

      // 5. Update execution record
      const updated = await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          output: result.output || null,
          error: result.error || null,
          durationMs,
          finishedAt,
        },
      });

      // 6. Track usage
      await this.usageService.trackExecution(userId, durationMs);

      this.logger.log(
        `Execution ${execution.id} completed in ${durationMs}ms (exit: ${result.exitCode})`,
      );

      return {
        id: updated.id,
        sandboxId: updated.sandboxId,
        output: updated.output,
        error: updated.error,
        durationMs: updated.durationMs || durationMs,
        startedAt: updated.startedAt,
        finishedAt: updated.finishedAt,
      };
    } catch (error: any) {
      const durationMs = Date.now() - startTime;

      // Update execution with error
      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          error: error.message || 'Unknown execution error',
          durationMs,
          finishedAt: new Date(),
        },
      });

      await this.usageService.trackExecution(userId, durationMs);

      throw error;
    }
  }

  /**
   * Execute code with streaming output (for WebSocket).
   */
  async executeCodeStreaming(
    userId: string,
    sandboxId: string,
    code: string,
    language: string,
    callbacks: {
      onData: (chunk: string, isStderr: boolean) => void;
      onDone: (execution: ExecutionResponseDto) => void;
      onError: (error: string) => void;
    },
  ): Promise<void> {
    // 1. Validate
    const sandbox = await this.sandboxService.validateRunningSandbox(userId, sandboxId);

    // 2. Check limit
    await this.usageService.checkExecutionLimit(userId);

    // 3. Create execution record
    const execution = await this.prisma.execution.create({
      data: {
        sandboxId,
        code,
        startedAt: new Date(),
      },
    });

    const startTime = Date.now();
    let fullOutput = '';
    let fullError = '';

    // 4. Stream execution
    await this.dockerService.executeCodeStreaming(
      sandbox.containerId!,
      code,
      language,
      this.EXECUTION_TIMEOUT_MS,
      {
        onData: (chunk, isStderr) => {
          if (isStderr) {
            fullError += chunk;
          } else {
            fullOutput += chunk;
          }
          callbacks.onData(chunk, isStderr);
        },
        onDone: async (exitCode) => {
          const durationMs = Date.now() - startTime;
          const finishedAt = new Date();

          const updated = await this.prisma.execution.update({
            where: { id: execution.id },
            data: {
              output: fullOutput || null,
              error: fullError || null,
              durationMs,
              finishedAt,
            },
          });

          await this.usageService.trackExecution(userId, durationMs);

          callbacks.onDone({
            id: updated.id,
            sandboxId: updated.sandboxId,
            output: updated.output,
            error: updated.error,
            durationMs: updated.durationMs || durationMs,
            startedAt: updated.startedAt,
            finishedAt: updated.finishedAt,
          });
        },
        onError: async (error) => {
          const durationMs = Date.now() - startTime;

          await this.prisma.execution.update({
            where: { id: execution.id },
            data: {
              error,
              durationMs,
              finishedAt: new Date(),
            },
          });

          await this.usageService.trackExecution(userId, durationMs);
          callbacks.onError(error);
        },
      },
    );
  }

  /**
   * List executions for a sandbox.
   */
  async listExecutions(
    userId: string,
    sandboxId: string,
  ): Promise<ExecutionResponseDto[]> {
    // Validate ownership
    await this.sandboxService.validateRunningSandbox(userId, sandboxId).catch(() => {
      // Also allow listing for non-running sandboxes that belong to the user
      return this.prisma.sandbox.findUnique({ where: { id: sandboxId } }).then((s) => {
        if (!s) throw new Error('Sandbox not found');
        if (s.userId !== userId) throw new Error('Access denied');
        return s;
      });
    });

    const executions = await this.prisma.execution.findMany({
      where: { sandboxId },
      orderBy: { startedAt: 'desc' },
    });

    return executions.map((e) => ({
      id: e.id,
      sandboxId: e.sandboxId,
      output: e.output,
      error: e.error,
      durationMs: e.durationMs || 0,
      startedAt: e.startedAt,
      finishedAt: e.finishedAt,
    }));
  }
}
