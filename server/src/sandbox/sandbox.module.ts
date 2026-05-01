import { Module } from '@nestjs/common';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';
import { DockerModule } from '../docker/docker.module';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [DockerModule, UsageModule],
  controllers: [SandboxController],
  providers: [SandboxService],
  exports: [SandboxService],
})
export class SandboxModule {}
