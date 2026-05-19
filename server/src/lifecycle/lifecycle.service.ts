import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { SandboxService } from '../sandbox/sandbox.service';

@Injectable()
export class LifecycleService implements OnModuleInit {
  private readonly logger = new Logger(LifecycleService.name);
  private isCheckingExpired = false;
  private isCleaningOrphans = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
    private readonly sandboxService: SandboxService,
    @InjectQueue('lifecycle-queue') private readonly queue: Queue,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing repeatable lifecycle jobs...');
      
      // Clean up existing repeatable jobs to prevent duplicates
      const repeatableJobs = await this.queue.getRepeatableJobs();
      for (const job of repeatableJobs) {
        await this.queue.removeRepeatableByKey(job.key);
      }

      // Expired sandbox check: every 60 seconds
      await this.queue.add('check-expired', {}, {
        repeat: { pattern: '*/1 * * * *' },
      });

      // Orphaned container cleanup: every 5 minutes
      await this.queue.add('cleanup-orphans', {}, {
        repeat: { pattern: '*/5 * * * *' },
      });

      this.logger.log('Repeatable lifecycle jobs configured successfully');
    } catch (error: any) {
      this.logger.error(`Failed to register repeatable jobs: ${error.message}`);
    }
  }

  /**
   * Background job: runs every 60 seconds to clean up expired sandboxes.
   * Idempotent — safe to run multiple times concurrently.
   */
  async handleExpiredSandboxes(): Promise<void> {
    if (this.isCheckingExpired) {
      this.logger.debug('Expired sandboxes check already running, skipping');
      return;
    }

    this.isCheckingExpired = true;

    try {
      // Find running sandboxes past their timeout
      const expiredSandboxes = await this.prisma.sandbox.findMany({
        where: {
          status: 'RUNNING',
          timeoutAt: { lte: new Date() },
        },
      });

      if (expiredSandboxes.length > 0) {
        this.logger.log(`Found ${expiredSandboxes.length} expired sandboxes to destroy`);
      }

      for (const sandbox of expiredSandboxes) {
        try {
          // Call sandboxService to destroy container and update status to TIMED_OUT
          await this.sandboxService.destroySandboxInternal(sandbox.id, 'TIMED_OUT');
          this.logger.log(`Auto-destroyed expired sandbox ID: ${sandbox.id}. Reason: Timeout reached`);
        } catch (error: any) {
          this.logger.error(`Failed to destroy expired sandbox ${sandbox.id}: ${error.message}`);
        }
      }
    } catch (error: any) {
      this.logger.error(`Expired sandboxes job failed: ${error.message}`);
    } finally {
      this.isCheckingExpired = false;
    }
  }

  /**
   * Clean up Docker containers that exist on the sandbox host
   * but are not tracked in the database.
   */
  async cleanupOrphanedContainers(): Promise<void> {
    if (this.isCleaningOrphans) {
      this.logger.debug('Orphan cleanup already running, skipping');
      return;
    }

    this.isCleaningOrphans = true;

    try {
      const containerIds = await this.dockerService.listCodelaveContainers();

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

      let orphanCount = 0;
      for (const containerId of containerIds) {
        if (!knownContainerIds.has(containerId)) {
          try {
            await this.dockerService.destroyContainer(containerId);
            orphanCount++;
            this.logger.warn(`Zombie container destroyed: ${containerId.substring(0, 12)}`);
          } catch (error: any) {
            this.logger.error(
              `Failed to destroy zombie container ${containerId.substring(0, 12)}: ${error.message}`,
            );
          }
        }
      }

      if (orphanCount > 0) {
        this.logger.log(`Cleaned up ${orphanCount} zombie containers`);
      }
    } catch (error: any) {
      this.logger.warn(`Orphan cleanup failed: ${error.message}`);
    } finally {
      this.isCleaningOrphans = false;
    }
  }
}
