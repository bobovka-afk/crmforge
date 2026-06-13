import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmoCrmCredentials } from './amocrm.types';

@Injectable()
export class AmoCrmOAuthService {
  constructor(private readonly config: ConfigService) {}

  buildAuthorizeUrl(state: string): string {
    const clientId = this.config.get<string>('AMOCRM_CLIENT_ID', '');
    const redirectUri = this.config.get<string>('AMOCRM_REDIRECT_URI', '');
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      state,
    });

    return `https://www.amocrm.ru/oauth?${params.toString()}`;
  }

  async exchangeCode(
    code: string,
    subdomain: string,
  ): Promise<AmoCrmCredentials> {
    const clientId = this.config.getOrThrow<string>('AMOCRM_CLIENT_ID');
    const clientSecret = this.config.getOrThrow<string>('AMOCRM_CLIENT_SECRET');
    const redirectUri = this.config.getOrThrow<string>('AMOCRM_REDIRECT_URI');

    const response = await axios.post(
      `https://${subdomain}.amocrm.ru/oauth2/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
    );

    return {
      subdomain,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000).toISOString(),
      clientId,
      clientSecret,
    };
  }
}
