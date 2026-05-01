import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSandboxDto {
  @ApiPropertyOptional({
    example: 'python3',
    description: 'Template name to use (e.g., python3, node, ubuntu)',
    default: 'python3',
  })
  @IsString()
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({
    example: 300,
    description: 'Timeout in seconds (default: 300, max: 3600)',
  })
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(3600)
  timeoutSeconds?: number;
}

export class SandboxResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false })
  template?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  timeoutAt!: Date;

  @ApiProperty({ required: false })
  destroyedAt?: Date | null;
}
