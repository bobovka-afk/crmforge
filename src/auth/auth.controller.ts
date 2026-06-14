import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CurrentUser, JoiValidationPipe, Public } from '../common';
import { JwtPayload } from '../common/interfaces';
import { REFRESH_TOKEN_COOKIE } from './constants';
import { AuthService } from './auth.service';
import { GoogleOAuthConfiguredGuard } from './guards';
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailQuerySchema,
} from './schemas';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  register(
    @Body(new JoiValidationPipe(registerSchema))
    body: {
      email: string;
      password: string;
      name?: string;
      locale?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(
    @Body(new JoiValidationPipe(loginSchema)) body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(body.email, body.password, res);
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email by token' })
  verifyEmail(
    @Query(new JoiValidationPipe(verifyEmailQuerySchema)) query: { token: string },
  ) {
    return this.authService.verifyEmail(query.token);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  resendVerification(
    @Body(new JoiValidationPipe(resendVerificationSchema)) body: { email: string },
  ) {
    return this.authService.resendVerification(body.email);
  }

  @Public()
  @Get('config')
  @ApiOperation({ summary: 'Public auth configuration' })
  getConfig() {
    return { googleOAuth: this.authService.isGoogleOAuthConfigured() };
  }

  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Redirect to Google OAuth' })
  @UseGuards(GoogleOAuthConfiguredGuard, AuthGuard('google'))
  googleAuth(): void {
    // Passport redirects
  }

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(GoogleOAuthConfiguredGuard, AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: { googleId: string; email: string; name?: string } },
    @Res() res: Response,
  ) {
    const result = await this.authService.handleGoogleUser(req.user, res);
    const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
    const redirectUrl = new URL('/auth/callback', appUrl);
    redirectUrl.searchParams.set('accessToken', result.accessToken);
    res.redirect(redirectUrl.toString());
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    return this.authService.refresh(refreshToken, res);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    return this.authService.logout(refreshToken, res, accessToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current user profile' })
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }
}
