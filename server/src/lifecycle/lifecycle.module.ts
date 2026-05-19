import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { LifecycleService } from './lifecycle.service';
import { LifecycleProcessor } from './lifecycle.processor';
import { DockerModule } from '../docker/docker.module';
import { SandboxModule } from '../sandbox/sandbox.module';

@Module({
  imports: [
    DockerModule, 
    SandboxModule,
    BullModule.registerQueue({
      name: 'lifecycle-queue',
    }),
  ],
  providers: [LifecycleService, LifecycleProcessor],
  exports: [LifecycleService],
})
export class LifecycleModule {}
