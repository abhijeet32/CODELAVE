import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { SandboxService } from '../sandbox/sandbox.service';

describe('FilesService', () => {
  let service: FilesService;
  let prisma: any;
  let dockerService: any;
  let sandboxService: any;

  beforeEach(async () => {
    prisma = {
      file: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    };
    dockerService = {
      copyFileToContainer: jest.fn().mockResolvedValue(undefined),
      getFileFromContainer: jest.fn(),
    };
    sandboxService = {
      validateRunningSandbox: jest.fn().mockResolvedValue({ id: 'sbx-1', containerId: 'c1', userId: 'u1' }),
      getSandbox: jest.fn().mockResolvedValue({ id: 'sbx-1' }),
    };
    const configService = { get: jest.fn((_k: string, d?: any) => d ?? 10485760) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: prisma },
        { provide: DockerService, useValue: dockerService },
        { provide: SandboxService, useValue: sandboxService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<FilesService>(FilesService);
  });

  it('should upload a file', async () => {
    prisma.file.create.mockResolvedValue({ id: 'f1', sandboxId: 'sbx-1', name: 'test.py', size: 100, uploadedAt: new Date() });
    const file = { originalname: 'test.py', size: 100, buffer: Buffer.from('hello') } as Express.Multer.File;
    const result = await service.uploadFile('u1', 'sbx-1', file);
    expect(result.name).toBe('test.py');
    expect(dockerService.copyFileToContainer).toHaveBeenCalled();
  });

  it('should reject files exceeding size limit', async () => {
    const file = { originalname: 'big.bin', size: 20 * 1024 * 1024, buffer: Buffer.alloc(0) } as Express.Multer.File;
    await expect(service.uploadFile('u1', 'sbx-1', file)).rejects.toThrow(BadRequestException);
  });

  it('should list files', async () => {
    prisma.file.findMany.mockResolvedValue([{ id: 'f1', sandboxId: 'sbx-1', name: 'test.py', size: 100, uploadedAt: new Date() }]);
    const result = await service.listFiles('u1', 'sbx-1');
    expect(result).toHaveLength(1);
  });
});
