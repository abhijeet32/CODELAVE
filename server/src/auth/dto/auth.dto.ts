import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password (min 8 chars)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  password!: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;
}

export class CreateApiKeyDto {
  @ApiProperty({
    example: 'My SDK Key',
    description: 'Human-readable name for the API key',
  })
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  userId!: string;
}

export class ApiKeyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ required: false })
  lastUsed?: Date | null;

  @ApiProperty()
  isActive!: boolean;
}

export class CreatedApiKeyResponseDto {
  @ApiProperty({ description: 'The plain API key — shown only once' })
  key!: string;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'strongPassword123', description: 'Current password' })
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword!: string;

  @ApiProperty({ example: 'newStrongPassword456', description: 'New Password (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @MaxLength(128, { message: 'New password must be at most 128 characters' })
  newPassword!: string;
}
