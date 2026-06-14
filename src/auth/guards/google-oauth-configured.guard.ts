import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthConfiguredGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(_context: ExecutionContext): boolean {
    if (!this.authService.isGoogleOAuthConfigured()) {
      throw new ServiceUnavailableException({
        code: 'GOOGLE_OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not configured',
      });
    }

    return true;
  }
}
