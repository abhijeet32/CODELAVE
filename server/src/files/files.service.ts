import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { DockerService } from '../docker/docker.service';
import { SandboxService } from '../sandbox/sandbox.service';
import { FileResponseDto } from './dto/files.dto';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly maxFileSize: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
    private readonly sandboxService: SandboxService,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get<number>(
      'SANDBOX_MAX_FILE_SIZE_BYTES',
      10 * 1024 * 1024,
    );
  }

  /**
   * Upload a file into a sandbox container.
   */
  async uploadFile(
    userId: string,
    sandboxId: string,
    file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    // 1. Validate sandbox
    const sandbox = await this.sandboxService.validateRunningSandbox(
      userId,
      sandboxId,
    );

    // 2. Enforce file size limit
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size is ${Math.floor(this.maxFileSize / 1024 / 1024)}MB`,
      );
    }

    // 3. Copy file into container
    await this.dockerService.copyFileToContainer(
      sandbox.containerId!,
      file.buffer,
      file.originalname,
    );

    // 4. Save file record to database
    const fileRecord = await this.prisma.file.create({
      data: {
        sandboxId,
        name: file.originalname,
        size: file.size,
      },
    });

    this.logger.log(
      `File uploaded: ${file.originalname} (${file.size} bytes) to sandbox ${sandboxId}`,
    );

    return {
      id: fileRecord.id,
      sandboxId: fileRecord.sandboxId,
      name: fileRecord.name,
      size: fileRecord.size,
      uploadedAt: fileRecord.uploadedAt,
    };
  }

  /**
   * List all files in a sandbox.
   */
  async listFiles(
    userId: string,
    sandboxId: string,
  ): Promise<FileResponseDto[]> {
    // Validate ownership (doesn't need to be running to list)
    await this.sandboxService.getSandbox(userId, sandboxId);

    const files = await this.prisma.file.findMany({
      where: { sandboxId },
      orderBy: { uploadedAt: 'desc' },
    });

    return files.map((f) => ({
      id: f.id,
      sandboxId: f.sandboxId,
      name: f.name,
      size: f.size,
      uploadedAt: f.uploadedAt,
    }));
  }

  /**
   * Download a file from a sandbox container.
   */
  async downloadFile(
    userId: string,
    sandboxId: string,
    fileName: string,
  ): Promise<Readable> {
    // Validate sandbox
    const sandbox = await this.sandboxService.validateRunningSandbox(
      userId,
      sandboxId,
    );

    // Check file exists in database
    const fileRecord = await this.prisma.file.findFirst({
      where: { sandboxId, name: fileName },
    });

    if (!fileRecord) {
      throw new NotFoundException(`File "${fileName}" not found in sandbox`);
    }

    // Get file from container
    const stream = await this.dockerService.getFileFromContainer(
      sandbox.containerId!,
      `/home/sandbox/${fileName}`,
    );

    return stream;
  }
}
