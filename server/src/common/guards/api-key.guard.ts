import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException(
        'Missing API key. Provide X-API-Key header.',
      );
    }

    // Hash the provided key and look it up
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: hashedKey },
      include: { user: true },
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('Invalid or revoked API key');
    }

    if (keyRecord.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    // Update last used timestamp (fire and forget)
    this.prisma.apiKey
      .update({
        where: { id: keyRecord.id },
        data: { lastUsed: new Date() },
      })
      .catch((err: Error) => {
        this.logger.warn(
          `Failed to update lastUsed for API key: ${err.message}`,
        );
      });

    // Attach user to request
    (request as any).user = {
      sub: keyRecord.userId,
      email: keyRecord.user.email,
    };
    (request as any).apiKeyId = keyRecord.id;

    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    // Support both X-API-Key header and Authorization: Bearer
    const headerKey = request.headers['x-api-key'] as string | undefined;
    if (headerKey) return headerKey;

    const authorization = request.headers.authorization;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer' && token) return token;
    }

    return undefined;
  }
}
