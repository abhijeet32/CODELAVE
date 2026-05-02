import { Module } from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { DockerModule } from '../docker/docker.module';
import { SandboxModule } from '../sandbox/sandbox.module';

@Module({
  imports: [DockerModule, SandboxModule],
  providers: [LifecycleService],
})
export class LifecycleModule {}
