import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LifecycleService } from './lifecycle.service';
import { Logger } from '@nestjs/common';

@Processor('lifecycle-queue')
export class LifecycleProcessor extends WorkerHost {
  private readonly logger = new Logger(LifecycleProcessor.name);

  constructor(private readonly lifecycleService: LifecycleService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing background job: ${job.name} (ID: ${job.id})`);
    try {
      switch (job.name) {
        case 'check-expired':
          await this.lifecycleService.handleExpiredSandboxes();
          break;
        case 'cleanup-orphans':
          await this.lifecycleService.cleanupOrphanedContainers();
          break;
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(`Job ${job.name} failed: ${error.message}`);
      throw error;
    }
  }
}
