import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../database/prisma.service';
import {
  AuthResponseDto,
  ApiKeyResponseDto,
  CreatedApiKeyResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user.
   */
  async register(email: string, password: string): Promise<AuthResponseDto> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const token = await this.generateToken(user.id, user.email);

    this.logger.log(`User registered: ${user.id}`);

    return {
      accessToken: token,
      userId: user.id,
    };
  }

  /**
   * Authenticate user and return JWT.
   */
  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id, user.email);

    this.logger.log(`User logged in: ${user.id}`);

    return {
      accessToken: token,
      userId: user.id,
    };
  }

  /**
   * Generate a new API key for the user.
   * Returns the plain key only once.
   */
  async createApiKey(
    userId: string,
    name: string,
  ): Promise<CreatedApiKeyResponseDto> {
    // Generate a unique API key
    const plainKey = `clv_${uuidv4().replace(/-/g, '')}${crypto.randomBytes(8).toString('hex')}`;

    // Hash before storing
    const hashedKey = crypto
      .createHash('sha256')
      .update(plainKey)
      .digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        key: hashedKey,
        name,
      },
    });

    this.logger.log(`API key created: ${apiKey.id} for user ${userId}`);

    return {
      key: plainKey,
      id: apiKey.id,
      name: apiKey.name,
    };
  }

  /**
   * List all API keys for a user (never return the hashed key).
   */
  async listApiKeys(userId: string): Promise<ApiKeyResponseDto[]> {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return keys;
  }

  /**
   * Revoke an API key.
   */
  async revokeApiKey(userId: string, keyId: string): Promise<void> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (apiKey.userId !== userId) {
      throw new ForbiddenException('You can only revoke your own API keys');
    }

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false },
    });

    this.logger.log(`API key revoked: ${keyId} by user ${userId}`);
  }

  // ─── PRIVATE ──────────────────────────────────────────

  private async generateToken(userId: string, email: string): Promise<string> {
    const payload: Record<string, string> = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '24h') as any,
    });
  }
}
