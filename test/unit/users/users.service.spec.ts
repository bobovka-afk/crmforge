import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { UsersService } from '../../../src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;

  const prisma = {
    user: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      deleteMany: jest.fn(),
    },
  };

  const authService = {
    getMe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('changePassword throws for OAuth-only accounts', async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      id: 'u1',
      passwordHash: null,
    });

    await expect(
      service.changePassword('u1', 'old', 'newpassword'),
    ).rejects.toThrow(ForbiddenException);
  });
});
