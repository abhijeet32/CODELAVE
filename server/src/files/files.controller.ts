import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/files.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('files')
@Controller('sandbox/:sandboxId/files')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file into a sandbox' })
  @ApiResponse({ status: 201, description: 'File uploaded', type: FileResponseDto })
  @ApiResponse({ status: 400, description: 'File too large or invalid' })
  async uploadFile(
    @Param('sandboxId') sandboxId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.filesService.uploadFile(user.sub, sandboxId, file);
  }

  @Get()
  @ApiOperation({ summary: 'List all files in a sandbox' })
  @ApiResponse({ status: 200, description: 'List of files', type: [FileResponseDto] })
  async listFiles(
    @Param('sandboxId') sandboxId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<FileResponseDto[]> {
    return this.filesService.listFiles(user.sub, sandboxId);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Download a file from a sandbox' })
  @ApiResponse({ status: 200, description: 'File stream' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadFile(
    @Param('sandboxId') sandboxId: string,
    @Param('name') name: string,
    @CurrentUser() user: CurrentUserPayload,
    @Res() res: Response,
  ): Promise<void> {
    const stream = await this.filesService.downloadFile(user.sub, sandboxId, name);

    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    stream.pipe(res);
  }
}
