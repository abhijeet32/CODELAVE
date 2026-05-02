import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsageService, UsageSummary } from './usage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('usage')
@Controller('usage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  @ApiOperation({ summary: 'Get current month usage for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Current usage summary' })
  async getCurrentUsage(@CurrentUser() user: CurrentUserPayload): Promise<UsageSummary> {
    return this.usageService.getOrCreateUsage(user.sub);
  }
}
