import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Mock bcrypt
jest.mock('bcrypt');
const mockBcrypt = bcrypt;

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    apiKey: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let jwtService: { signAsync: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      apiKey: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          JWT_SECRET: 'test-secret',
          JWT_EXPIRATION: '24h',
        };
        return config[key] ?? defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return JWT', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
      });
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.register('test@example.com', 'password123');

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.userId).toBe('user-1');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed-password',
        },
      });
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register('test@example.com', 'password123'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return JWT on valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
        status: 'ACTIVE',
      });
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password123');

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.userId).toBe('user-1');
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
        status: 'ACTIVE',
      });
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if user is not active', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
        status: 'SUSPENDED',
      });

      await expect(
        service.login('test@example.com', 'password123'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createApiKey', () => {
    it('should create and return a new API key', async () => {
      prisma.apiKey.create.mockResolvedValue({
        id: 'key-1',
        name: 'My Key',
        userId: 'user-1',
      });

      const result = await service.createApiKey('user-1', 'My Key');

      expect(result.id).toBe('key-1');
      expect(result.name).toBe('My Key');
      expect(result.key).toContain('clv_');
      // Verify the stored key is hashed (not plain)
      expect(prisma.apiKey.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          name: 'My Key',
          key: expect.not.stringContaining('clv_'),
        }),
      });
    });
  });

  describe('listApiKeys', () => {
    it('should return keys without hashed values', async () => {
      prisma.apiKey.findMany.mockResolvedValue([
        {
          id: 'key-1',
          name: 'Key 1',
          createdAt: new Date(),
          lastUsed: null,
          isActive: true,
        },
        {
          id: 'key-2',
          name: 'Key 2',
          createdAt: new Date(),
          lastUsed: new Date(),
          isActive: false,
        },
      ]);

      const result = await service.listApiKeys('user-1');

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('key');
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an API key', async () => {
      prisma.apiKey.findUnique.mockResolvedValue({
        id: 'key-1',
        userId: 'user-1',
      });
      prisma.apiKey.update.mockResolvedValue({ id: 'key-1', isActive: false });

      await service.revokeApiKey('user-1', 'key-1');

      expect(prisma.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'key-1' },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException if key not found', async () => {
      prisma.apiKey.findUnique.mockResolvedValue(null);

      await expect(
        service.revokeApiKey('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if key belongs to another user', async () => {
      prisma.apiKey.findUnique.mockResolvedValue({
        id: 'key-1',
        userId: 'other-user',
      });

      await expect(service.revokeApiKey('user-1', 'key-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
