import { Test, TestingModule } from '@nestjs/testing';
import { LifecycleService } from './lifecycle.service';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { SandboxService } from '../sandbox/sandbox.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('LifecycleService', () => {
  let service: LifecycleService;
  let prisma: any;
  let dockerService: any;
  let sandboxService: any;
  let queue: any;

  beforeEach(async () => {
    prisma = {
      sandbox: { findMany: jest.fn().mockResolvedValue([]) },
    };
    dockerService = {
      listCodelaveContainers: jest.fn().mockResolvedValue([]),
      destroyContainer: jest.fn().mockResolvedValue(undefined),
    };
    sandboxService = {
      destroySandboxInternal: jest.fn().mockResolvedValue(undefined),
    };
    queue = {
      getRepeatableJobs: jest.fn().mockResolvedValue([]),
      removeRepeatableByKey: jest.fn().mockResolvedValue(undefined),
      add: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LifecycleService,
        { provide: PrismaService, useValue: prisma },
        { provide: DockerService, useValue: dockerService },
        { provide: SandboxService, useValue: sandboxService },
        { provide: getQueueToken('lifecycle-queue'), useValue: queue },
      ],
    }).compile();
    service = module.get<LifecycleService>(LifecycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should destroy expired sandboxes', async () => {
    prisma.sandbox.findMany
      .mockResolvedValueOnce([
        { id: 'sbx-1', status: 'RUNNING', containerId: 'c1' },
        { id: 'sbx-2', status: 'RUNNING', containerId: 'c2' },
      ])
      .mockResolvedValue([]);

    await service.handleExpiredSandboxes();

    expect(sandboxService.destroySandboxInternal).toHaveBeenCalledTimes(2);
  });

  it('should handle errors gracefully during cleanup', async () => {
    prisma.sandbox.findMany
      .mockResolvedValueOnce([
        { id: 'sbx-1', status: 'RUNNING', containerId: 'c1' },
      ])
      .mockResolvedValue([]);
    sandboxService.destroySandboxInternal.mockRejectedValue(new Error('fail'));

    // Should not throw
    await expect(service.handleExpiredSandboxes()).resolves.not.toThrow();
  });

  it('should skip overlapping runs', async () => {
    (service as any).isCheckingExpired = true;
    await service.handleExpiredSandboxes();
    expect(prisma.sandbox.findMany).not.toHaveBeenCalled();
  });
});
