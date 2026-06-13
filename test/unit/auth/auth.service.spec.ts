import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthService } from '../../../src/auth/auth.service';
import { CacheService } from '../../../src/cache/cache.service';
import { MailService } from '../../../src/mail/mail.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    refreshToken: {
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('access-token') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const map: Record<string, string> = {
                JWT_REFRESH_EXPIRES: '7d',
                NODE_ENV: 'test',
              };
              return map[key] ?? defaultValue;
            }),
          },
        },
        {
          provide: MailService,
          useValue: { sendVerificationEmail: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: {
            blacklistAccessToken: jest.fn(),
            isAccessTokenBlacklisted: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('register throws ConflictException if email exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' });

    await expect(
      service.register({ email: 'a@b.com', password: 'password123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('login throws UnauthorizedException for invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login('a@b.com', 'wrong', res),
    ).rejects.toThrow(UnauthorizedException);
  });
});
