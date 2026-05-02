import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sandboxId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  size!: number;

  @ApiProperty()
  uploadedAt!: Date;
}
