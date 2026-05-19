import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsageService } from './usage.service';
import { PrismaService } from '../database/prisma.service';

describe('UsageService', () => {
  let service: UsageService;
  let prisma: any;

  beforeEach(async () => {
    prisma = { usage: { upsert: jest.fn() } };
    const configService = {
      get: jest.fn((key: string, def?: any) => {
        const c: Record<string, any> = {
          FREE_TIER_MAX_SANDBOXES: 5,
          FREE_TIER_MAX_EXECUTIONS: 100,
          FREE_TIER_MAX_COMPUTE_SECONDS: 600,
        };
        return c[key] ?? def;
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsageService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<UsageService>(UsageService);
  });

  it('getCurrentMonth returns YYYY-MM', () => {
    expect(service.getCurrentMonth()).toMatch(/^\d{4}-\d{2}$/);
  });

  it('getOrCreateUsage returns usage with limits', async () => {
    prisma.usage.upsert.mockResolvedValue({
      month: '2026-05',
      sandboxCount: 2,
      executionCount: 10,
      computeSeconds: 120,
    });
    const r = await service.getOrCreateUsage('u1');
    expect(r.sandboxCount).toBe(2);
    expect(r.limits.maxSandboxes).toBe(5);
  });

  it('checkSandboxLimit passes under limit', async () => {
    prisma.usage.upsert.mockResolvedValue({
      month: '2026-05',
      sandboxCount: 3,
      executionCount: 10,
      computeSeconds: 120,
    });
    await expect(service.checkSandboxLimit('u1')).resolves.not.toThrow();
  });

  it('checkSandboxLimit throws 429 at limit', async () => {
    prisma.usage.upsert.mockResolvedValue({
      month: '2026-05',
      sandboxCount: 5,
      executionCount: 10,
      computeSeconds: 120,
    });
    await expect(service.checkSandboxLimit('u1')).rejects.toThrow(
      HttpException,
    );
  });

  it('checkExecutionLimit throws 429 at limit', async () => {
    prisma.usage.upsert.mockResolvedValue({
      month: '2026-05',
      sandboxCount: 1,
      executionCount: 100,
      computeSeconds: 120,
    });
    await expect(service.checkExecutionLimit('u1')).rejects.toThrow(
      HttpException,
    );
  });

  it('incrementSandboxCount calls upsert', async () => {
    prisma.usage.upsert.mockResolvedValue({});
    await service.incrementSandboxCount('u1');
    expect(prisma.usage.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { sandboxCount: { increment: 1 } } }),
    );
  });

  it('trackExecution tracks duration', async () => {
    prisma.usage.upsert.mockResolvedValue({});
    await service.trackExecution('u1', 5000);
    expect(prisma.usage.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: {
          executionCount: { increment: 1 },
          computeSeconds: { increment: 5 },
        },
      }),
    );
  });
});
