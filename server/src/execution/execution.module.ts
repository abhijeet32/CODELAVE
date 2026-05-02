import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { ExecutionGateway } from './execution.gateway';
import { DockerModule } from '../docker/docker.module';
import { UsageModule } from '../usage/usage.module';
import { SandboxModule } from '../sandbox/sandbox.module';

@Module({
  imports: [DockerModule, UsageModule, SandboxModule],
  controllers: [ExecutionController],
  providers: [ExecutionService, ExecutionGateway],
  exports: [ExecutionService],
})
export class ExecutionModule {}
