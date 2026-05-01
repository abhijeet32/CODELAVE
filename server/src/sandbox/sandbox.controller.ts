import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SandboxService } from './sandbox.service';
import { CreateSandboxDto, SandboxResponseDto } from './dto/sandbox.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('sandbox')
@Controller('sandbox')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sandbox' })
  @ApiResponse({ status: 201, description: 'Sandbox created', type: SandboxResponseDto })
  @ApiResponse({ status: 429, description: 'Free tier limit exceeded' })
  async createSandbox(
    @Body() dto: CreateSandboxDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SandboxResponseDto> {
    return this.sandboxService.createSandbox(
      user.sub,
      dto.template,
      dto.timeoutSeconds,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all sandboxes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of sandboxes', type: [SandboxResponseDto] })
  async listSandboxes(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SandboxResponseDto[]> {
    return this.sandboxService.listSandboxes(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sandbox details' })
  @ApiResponse({ status: 200, description: 'Sandbox details', type: SandboxResponseDto })
  @ApiResponse({ status: 404, description: 'Sandbox not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getSandbox(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SandboxResponseDto> {
    return this.sandboxService.getSandbox(user.sub, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Destroy a sandbox' })
  @ApiResponse({ status: 204, description: 'Sandbox destroyed' })
  @ApiResponse({ status: 404, description: 'Sandbox not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async destroySandbox(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return this.sandboxService.destroySandbox(user.sub, id);
  }
}
