import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionService } from './execution.service';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { UsageService } from '../usage/usage.service';
import { SandboxService } from '../sandbox/sandbox.service';

describe('ExecutionService', () => {
  let service: ExecutionService;
  let prisma: any;
  let dockerService: any;
  let usageService: any;
  let sandboxService: any;

  beforeEach(async () => {
    prisma = {
      execution: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      sandbox: {
        findUnique: jest.fn(),
      },
    };

    dockerService = {
      executeCode: jest.fn(),
      executeCodeStreaming: jest.fn(),
    };

    usageService = {
      checkExecutionLimit: jest.fn().mockResolvedValue(undefined),
      trackExecution: jest.fn().mockResolvedValue(undefined),
    };

    sandboxService = {
      validateRunningSandbox: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutionService,
        { provide: PrismaService, useValue: prisma },
        { provide: DockerService, useValue: dockerService },
        { provide: UsageService, useValue: usageService },
        { provide: SandboxService, useValue: sandboxService },
      ],
    }).compile();

    service = module.get<ExecutionService>(ExecutionService);
  });

  describe('executeCode', () => {
    it('should execute code and return result', async () => {
      sandboxService.validateRunningSandbox.mockResolvedValue({
        id: 'sbx-1',
        containerId: 'container-123',
        userId: 'user-1',
      });

      prisma.execution.create.mockResolvedValue({
        id: 'exec-1',
        sandboxId: 'sbx-1',
        code: 'print("hello")',
        startedAt: new Date(),
      });

      dockerService.executeCode.mockResolvedValue({
        output: 'hello\n',
        error: '',
        exitCode: 0,
      });

      prisma.execution.update.mockResolvedValue({
        id: 'exec-1',
        sandboxId: 'sbx-1',
        output: 'hello\n',
        error: '',
        durationMs: 150,
        startedAt: new Date(),
        finishedAt: new Date(),
      });

      const result = await service.executeCode('user-1', 'sbx-1', 'print("hello")', 'python');

      expect(result.id).toBe('exec-1');
      expect(result.output).toBe('hello\n');
      expect(usageService.checkExecutionLimit).toHaveBeenCalledWith('user-1');
      expect(usageService.trackExecution).toHaveBeenCalled();
    });

    it('should save error to execution record on failure', async () => {
      sandboxService.validateRunningSandbox.mockResolvedValue({
        id: 'sbx-1',
        containerId: 'container-123',
        userId: 'user-1',
      });

      prisma.execution.create.mockResolvedValue({
        id: 'exec-1',
        sandboxId: 'sbx-1',
        code: 'invalid code',
        startedAt: new Date(),
      });

      dockerService.executeCode.mockRejectedValue(new Error('Container crashed'));
      prisma.execution.update.mockResolvedValue({});

      await expect(
        service.executeCode('user-1', 'sbx-1', 'invalid code', 'python'),
      ).rejects.toThrow('Container crashed');

      expect(prisma.execution.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'exec-1' },
          data: expect.objectContaining({
            error: 'Container crashed',
          }),
        }),
      );
    });
  });

  describe('listExecutions', () => {
    it('should return execution list for a sandbox', async () => {
      sandboxService.validateRunningSandbox.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
      });

      prisma.execution.findMany.mockResolvedValue([
        {
          id: 'exec-1',
          sandboxId: 'sbx-1',
          output: 'hello',
          error: null,
          durationMs: 100,
          startedAt: new Date(),
          finishedAt: new Date(),
        },
      ]);

      const result = await service.listExecutions('user-1', 'sbx-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('exec-1');
    });
  });
});
