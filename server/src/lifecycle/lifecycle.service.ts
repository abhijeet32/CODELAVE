import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { SandboxService } from '../sandbox/sandbox.service';

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
    private readonly sandboxService: SandboxService,
  ) {}

  /**
   * Cron job: runs every minute to clean up expired sandboxes.
   * Idempotent — safe to run multiple times concurrently.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredSandboxes(): Promise<void> {
    // Prevent overlapping runs
    if (this.isRunning) {
      this.logger.debug('Lifecycle job already running, skipping');
      return;
    }

    this.isRunning = true;

    try {
      // 1. Find all sandboxes past their timeout
      const expiredSandboxes = await this.prisma.sandbox.findMany({
        where: {
          status: { in: ['RUNNING', 'CREATING'] },
          timeoutAt: { lte: new Date() },
        },
      });

      if (expiredSandboxes.length > 0) {
        this.logger.log(`Found ${expiredSandboxes.length} expired sandboxes`);
      }

      // 2. Destroy each expired sandbox
      for (const sandbox of expiredSandboxes) {
        try {
          await this.sandboxService.destroySandboxInternal(sandbox.id);
          this.logger.log(`Expired sandbox destroyed: ${sandbox.id}`);
        } catch (error: any) {
          this.logger.error(
            `Failed to destroy expired sandbox ${sandbox.id}: ${error.message}`,
          );
        }
      }

      // 3. Clean up orphaned containers (containers not tracked in DB)
      await this.cleanupOrphanedContainers();
    } catch (error: any) {
      this.logger.error(`Lifecycle job failed: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Clean up Docker containers that exist on the sandbox host
   * but are not tracked in the database.
   */
  private async cleanupOrphanedContainers(): Promise<void> {
    try {
      const containerIds = await this.dockerService.listCodelaveContainers();

      if (containerIds.length === 0) return;

      // Get all known container IDs from database
      const knownSandboxes = await this.prisma.sandbox.findMany({
        where: {
          status: { in: ['RUNNING', 'CREATING'] },
          containerId: { not: null },
        },
        select: { containerId: true },
      });

      const knownContainerIds = new Set(
        knownSandboxes
          .map((s) => s.containerId)
          .filter((id): id is string => id !== null),
      );

      // Find containers that are not tracked
      let orphanCount = 0;
      for (const containerId of containerIds) {
        if (!knownContainerIds.has(containerId)) {
          try {
            await this.dockerService.destroyContainer(containerId);
            orphanCount++;
            this.logger.warn(`Orphaned container destroyed: ${containerId.substring(0, 12)}`);
          } catch (error: any) {
            this.logger.error(
              `Failed to destroy orphaned container ${containerId.substring(0, 12)}: ${error.message}`,
            );
          }
        }
      }

      if (orphanCount > 0) {
        this.logger.log(`Cleaned up ${orphanCount} orphaned containers`);
      }
    } catch (error: any) {
      // Docker daemon might be unreachable — that's OK, we'll try again next minute
      this.logger.warn(`Orphan cleanup skipped: ${error.message}`);
    }
  }
}
