import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { UsageService } from '../usage/usage.service';

describe('SandboxService', () => {
  let service: SandboxService;
  let prisma: any;
  let dockerService: any;
  let usageService: any;
  let configService: any;

  beforeEach(async () => {
    prisma = {
      sandbox: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      template: {
        findUnique: jest.fn(),
      },
    };

    dockerService = {
      createContainer: jest.fn().mockResolvedValue('container-123'),
      destroyContainer: jest.fn().mockResolvedValue(undefined),
      getContainerStatus: jest.fn().mockResolvedValue('running'),
    };

    usageService = {
      checkSandboxLimit: jest.fn().mockResolvedValue(undefined),
      incrementSandboxCount: jest.fn().mockResolvedValue(undefined),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          SANDBOX_DEFAULT_TIMEOUT_SECONDS: 300,
          SANDBOX_MEMORY_LIMIT: '256m',
          SANDBOX_CPU_LIMIT: '0.5',
          SANDBOX_PID_LIMIT: 64,
        };
        return config[key] ?? defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SandboxService,
        { provide: PrismaService, useValue: prisma },
        { provide: DockerService, useValue: dockerService },
        { provide: UsageService, useValue: usageService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<SandboxService>(SandboxService);
  });

  describe('createSandbox', () => {
    it('should create a sandbox with Docker container', async () => {
      prisma.template.findUnique.mockResolvedValue({
        id: 'tmpl-1',
        name: 'python3',
        dockerImage: 'python:3.11-slim',
        hasInternet: false,
      });
      prisma.sandbox.create.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'CREATING',
        timeoutAt: new Date(),
      });
      prisma.sandbox.update.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'RUNNING',
        containerId: 'container-123',
        createdAt: new Date(),
        timeoutAt: new Date(),
        destroyedAt: null,
        template: { name: 'python3' },
      });

      const result = await service.createSandbox('user-1', 'python3');

      expect(result.id).toBe('sbx-1');
      expect(result.status).toBe('RUNNING');
      expect(usageService.checkSandboxLimit).toHaveBeenCalledWith('user-1');
      expect(dockerService.createContainer).toHaveBeenCalled();
      expect(usageService.incrementSandboxCount).toHaveBeenCalledWith('user-1');
    });

    it('should mark sandbox as ERROR if Docker fails', async () => {
      prisma.template.findUnique.mockResolvedValue(null);
      prisma.sandbox.create.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'CREATING',
        timeoutAt: new Date(),
      });
      dockerService.createContainer.mockRejectedValue(new Error('Docker unreachable'));
      prisma.sandbox.update.mockResolvedValue({});

      await expect(
        service.createSandbox('user-1'),
      ).rejects.toThrow('Docker unreachable');

      expect(prisma.sandbox.update).toHaveBeenCalledWith({
        where: { id: 'sbx-1' },
        data: { status: 'ERROR' },
      });
    });
  });

  describe('getSandbox', () => {
    it('should return sandbox for the owner', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'RUNNING',
        createdAt: new Date(),
        timeoutAt: new Date(),
        destroyedAt: null,
        template: { name: 'python3' },
      });

      const result = await service.getSandbox('user-1', 'sbx-1');
      expect(result.id).toBe('sbx-1');
    });

    it('should throw NotFoundException if sandbox does not exist', async () => {
      prisma.sandbox.findUnique.mockResolvedValue(null);

      await expect(
        service.getSandbox('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for non-owner', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'other-user',
        status: 'RUNNING',
        template: { name: 'python3' },
      });

      await expect(
        service.getSandbox('user-1', 'sbx-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('destroySandbox', () => {
    it('should stop container and update database', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'RUNNING',
        containerId: 'container-123',
      });
      prisma.sandbox.update.mockResolvedValue({});

      await service.destroySandbox('user-1', 'sbx-1');

      expect(dockerService.destroyContainer).toHaveBeenCalledWith('container-123');
      expect(prisma.sandbox.update).toHaveBeenCalledWith({
        where: { id: 'sbx-1' },
        data: expect.objectContaining({
          status: 'DESTROYED',
        }),
      });
    });

    it('should throw ForbiddenException for non-owner', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'other-user',
        status: 'RUNNING',
      });

      await expect(
        service.destroySandbox('user-1', 'sbx-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if already destroyed', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'DESTROYED',
      });

      await expect(
        service.destroySandbox('user-1', 'sbx-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateRunningSandbox', () => {
    it('should return sandbox when valid', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'RUNNING',
        containerId: 'container-123',
      });

      const result = await service.validateRunningSandbox('user-1', 'sbx-1');
      expect(result.containerId).toBe('container-123');
    });

    it('should throw BadRequestException if not running', async () => {
      prisma.sandbox.findUnique.mockResolvedValue({
        id: 'sbx-1',
        userId: 'user-1',
        status: 'STOPPED',
        containerId: 'container-123',
      });

      await expect(
        service.validateRunningSandbox('user-1', 'sbx-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
