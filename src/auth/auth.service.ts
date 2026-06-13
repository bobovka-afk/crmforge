import { createHash, randomBytes, randomUUID } from 'crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtPayload } from '../common/interfaces';
import { AppErrors } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CacheService } from '../cache/cache.service';
import {
  BCRYPT_ROUNDS,
  EMAIL_VERIFICATION_TTL_HOURS,
  REFRESH_TOKEN_COOKIE,
} from './constants';
import {
  AuthResponse,
  MessageResponse,
  RegisterResponse,
  UserResponse,
} from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly cache: CacheService,
  ) {}

  async register(input: {
    email: string;
    password: string;
    name?: string;
    locale?: string;
  }): Promise<RegisterResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new ConflictException(AppErrors.EMAIL_ALREADY_REGISTERED);
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(
      Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000,
    );

    await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        locale: input.locale ?? 'ru',
        authProvider: 'local',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    await this.mail.sendVerificationEmail(input.email, verificationToken);

    return { message: 'Registration successful. Please check your email.' };
  }

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash) {
      throw new UnauthorizedException(AppErrors.INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException(AppErrors.INVALID_CREDENTIALS);
    }

    if (!user.emailVerified) {
      throw new ForbiddenException(AppErrors.EMAIL_NOT_VERIFIED);
    }

    return this.issueTokens(user, res);
  }

  async verifyEmail(token: string): Promise<MessageResponse> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException(AppErrors.INVALID_VERIFICATION_TOKEN);
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new UnauthorizedException(AppErrors.VERIFICATION_TOKEN_EXPIRED);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string): Promise<MessageResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) {
      return { message: 'If the account exists, a verification email was sent' };
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(
      Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    await this.mail.sendVerificationEmail(email, verificationToken);

    return { message: 'If the account exists, a verification email was sent' };
  }

  async refresh(refreshToken: string | undefined, res: Response): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException(AppErrors.REFRESH_TOKEN_MISSING);
    }

    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException(AppErrors.INVALID_REFRESH_TOKEN);
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(stored.user, res);
  }

  async logout(
    refreshToken: string | undefined,
    res: Response,
    accessToken?: string,
  ): Promise<MessageResponse> {
    if (accessToken) {
      await this.blacklistAccessToken(accessToken);
    }

    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
    }

    this.clearRefreshCookie(res);
    return { message: 'Logged out' };
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return this.toUserResponse(user);
  }

  async handleGoogleUser(profile: {
    googleId: string;
    email: string;
    name?: string;
  }, res: Response): Promise<AuthResponse> {
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      const byEmail = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (byEmail) {
        user = await this.prisma.user.update({
          where: { id: byEmail.id },
          data: {
            googleId: profile.googleId,
            authProvider: 'google',
            emailVerified: true,
            name: byEmail.name ?? profile.name,
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            email: profile.email,
            googleId: profile.googleId,
            name: profile.name,
            authProvider: 'google',
            emailVerified: true,
          },
        });
      }
    }

    return this.issueTokens(user, res);
  }

  private async issueTokens(user: User, res: Response): Promise<AuthResponse> {
    const jti = randomUUID();
    const payload: JwtPayload = { sub: user.id, email: user.email, jti };
    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = randomBytes(48).toString('hex');
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES', '7d');
    const expiresAt = this.parseExpiry(refreshExpires);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
      },
    });

    this.setRefreshCookie(res, refreshToken, expiresAt);

    return {
      user: this.toUserResponse(user),
      accessToken,
    };
  }

  private setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/api/auth',
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth' });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async blacklistAccessToken(accessToken: string): Promise<void> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(accessToken);
      if (payload.jti) {
        await this.cache.blacklistAccessToken(
          payload.jti,
          this.parseDurationMs(this.config.get<string>('JWT_ACCESS_EXPIRES', '15m')),
        );
      }
    } catch {
      // ignore invalid access token on logout
    }
  }

  private parseDurationMs(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) {
      return 15 * 60 * 1000;
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return amount * multipliers[unit];
  }

  private parseExpiry(value: string): Date {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + amount * multipliers[unit]);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      locale: user.locale,
      authProvider: user.authProvider,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}
