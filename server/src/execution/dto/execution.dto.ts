import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecuteCodeDto {
  @ApiProperty({
    example: 'print("Hello, World!")',
    description: 'Code to execute inside the sandbox',
  })
  @IsString()
  @MaxLength(100000, { message: 'Code must be at most 100000 characters' })
  code!: string;

  @ApiPropertyOptional({
    example: 'python',
    description: 'Language/runtime to use (python, javascript, bash, etc.)',
    default: 'python',
  })
  @IsString()
  @IsOptional()
  language?: string;
}

export class ExecutionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sandboxId!: string;

  @ApiProperty({ required: false })
  output?: string | null;

  @ApiProperty({ required: false })
  error?: string | null;

  @ApiProperty()
  durationMs!: number;

  @ApiProperty()
  startedAt!: Date;

  @ApiProperty({ required: false })
  finishedAt?: Date | null;
}
