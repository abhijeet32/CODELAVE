import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { ExecuteCodeDto, ExecutionResponseDto } from './dto/execution.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../common/decorators/current-user.decorator';

@ApiTags('execution')
@Controller('sandbox/:sandboxId/execute')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post()
  @ApiOperation({ summary: 'Execute code inside a sandbox' })
  @ApiResponse({
    status: 201,
    description: 'Execution result',
    type: ExecutionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Sandbox not running' })
  @ApiResponse({ status: 404, description: 'Sandbox not found' })
  @ApiResponse({ status: 429, description: 'Execution limit exceeded' })
  async executeCode(
    @Param('sandboxId') sandboxId: string,
    @Body() dto: ExecuteCodeDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ExecutionResponseDto> {
    return this.executionService.executeCode(
      user.sub,
      sandboxId,
      dto.code,
      dto.language || 'python',
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all executions for a sandbox' })
  @ApiResponse({
    status: 200,
    description: 'List of executions',
    type: [ExecutionResponseDto],
  })
  async listExecutions(
    @Param('sandboxId') sandboxId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ExecutionResponseDto[]> {
    return this.executionService.listExecutions(user.sub, sandboxId);
  }
}
