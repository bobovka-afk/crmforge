import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from '../../cache/cache.service';
import { AppErrors } from '../../common/errors';
import { JwtPayload } from '../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly cache: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub || !payload.email || !payload.jti) {
      throw new UnauthorizedException(AppErrors.UNAUTHORIZED);
    }

    if (await this.cache.isAccessTokenBlacklisted(payload.jti)) {
      throw new UnauthorizedException(AppErrors.TOKEN_REVOKED);
    }

    return payload;
  }
}
