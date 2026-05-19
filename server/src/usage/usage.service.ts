import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

export interface UsageLimits {
  maxSandboxes: number;
  maxExecutions: number;
  maxComputeSeconds: number;
}

export interface UsageSummary {
  month: string;
  sandboxCount: number;
  executionCount: number;
  computeSeconds: number;
  limits: UsageLimits;
}

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the current month string in YYYY-MM format.
   */
  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Get or create usage record for a user in the current month.
   */
  async getOrCreateUsage(
    userId: string,
    month?: string,
  ): Promise<UsageSummary> {
    const currentMonth = month || this.getCurrentMonth();

    const usage = await this.prisma.usage.upsert({
      where: {
        userId_month: { userId, month: currentMonth },
      },
      create: {
        userId,
        month: currentMonth,
        sandboxCount: 0,
        executionCount: 0,
        computeSeconds: 0,
      },
      update: {},
    });

    return {
      month: usage.month,
      sandboxCount: usage.sandboxCount,
      executionCount: usage.executionCount,
      computeSeconds: usage.computeSeconds,
      limits: this.getLimitsForUser(userId),
    };
  }

  /**
   * Check if the user can create a new sandbox.
   * Throws 429 if limit exceeded.
   */
  async checkSandboxLimit(userId: string): Promise<void> {
    const limits = this.getLimitsForUser(userId);
    const usage = await this.getOrCreateUsage(userId);

    if (usage.sandboxCount >= limits.maxSandboxes) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Free tier limit reached: maximum ${limits.maxSandboxes} sandboxes per month`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Check if the user can execute code.
   * Throws 429 if limit exceeded.
   */
  async checkExecutionLimit(userId: string): Promise<void> {
    const limits = this.getLimitsForUser(userId);
    const usage = await this.getOrCreateUsage(userId);

    if (usage.executionCount >= limits.maxExecutions) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Free tier limit reached: maximum ${limits.maxExecutions} executions per month`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Increment sandbox count for the current month.
   */
  async incrementSandboxCount(userId: string): Promise<void> {
    const month = this.getCurrentMonth();

    await this.prisma.usage.upsert({
      where: {
        userId_month: { userId, month },
      },
      create: {
        userId,
        month,
        sandboxCount: 1,
        executionCount: 0,
        computeSeconds: 0,
      },
      update: {
        sandboxCount: { increment: 1 },
      },
    });
  }

  /**
   * Increment execution count and compute seconds.
   */
  async trackExecution(userId: string, durationMs: number): Promise<void> {
    const month = this.getCurrentMonth();
    const computeSeconds = durationMs / 1000;

    await this.prisma.usage.upsert({
      where: {
        userId_month: { userId, month },
      },
      create: {
        userId,
        month,
        sandboxCount: 0,
        executionCount: 1,
        computeSeconds,
      },
      update: {
        executionCount: { increment: 1 },
        computeSeconds: { increment: computeSeconds },
      },
    });
  }

  /**
   * Get usage limits for a user based on their plan.
   */
  private getLimitsForUser(_userId: string): UsageLimits {
    // For now, return free tier limits from config.
    // In the future, look up the user's plan and return appropriate limits.
    return {
      maxSandboxes: this.configService.get<number>(
        'FREE_TIER_MAX_SANDBOXES',
        5,
      ),
      maxExecutions: this.configService.get<number>(
        'FREE_TIER_MAX_EXECUTIONS',
        100,
      ),
      maxComputeSeconds: this.configService.get<number>(
        'FREE_TIER_MAX_COMPUTE_SECONDS',
        600,
      ),
    };
  }
}
