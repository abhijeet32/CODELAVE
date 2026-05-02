import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DockerModule } from '../docker/docker.module';
import { SandboxModule } from '../sandbox/sandbox.module';

@Module({
  imports: [DockerModule, SandboxModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
