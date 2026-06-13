import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Integration } from '@prisma/client';
import { randomBytes } from 'crypto';
import { CacheService } from '../cache/cache.service';
import { AppErrors } from '../common/errors';
import { EncryptionService } from '../common/encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { AmoCrmOAuthService } from './amocrm/amocrm-oauth.service';
import { AmoCrmProviderService } from './amocrm/amocrm-provider.service';
import {
  AmoCrmCredentials,
  AmoCrmIntegrationStatus,
} from './amocrm/amocrm.types';

const AMOCRM_PROVIDER = 'amocrm';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly amoCrm: AmoCrmProviderService,
    private readonly amoOAuth: AmoCrmOAuthService,
    private readonly cache: CacheService,
    private readonly config: ConfigService,
  ) {}

  async list(userId: string) {
    const integrations = await this.prisma.integration.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        status: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { data: integrations };
  }

  async getAmoCrmStatus(userId: string): Promise<AmoCrmIntegrationStatus> {
    const cached = await this.cache.getAmoStatus<AmoCrmIntegrationStatus>(userId);
    if (cached) {
      return cached;
    }

    const integration = await this.prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: AMOCRM_PROVIDER } },
    });

    const status = this.toAmoStatus(integration);
    await this.cache.setAmoStatus(userId, status);
    return status;
  }

  async connectAmoCrm(
    userId: string,
    input: { subdomain: string; clientId?: string; clientSecret?: string },
  ) {
    const isMock = this.config.get<boolean>('AMOCRM_MOCK', true);
    const credentials: AmoCrmCredentials = isMock
      ? {
          subdomain: input.subdomain,
          accessToken: `mock-access-${userId}`,
          refreshToken: `mock-refresh-${userId}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      : {
          subdomain: input.subdomain,
          accessToken: '',
          refreshToken: '',
          expiresAt: new Date().toISOString(),
          clientId: input.clientId,
          clientSecret: input.clientSecret,
        };

    if (isMock) {
      const ok = await this.amoCrm.testConnection(credentials);
      if (!ok) {
        throw new BadRequestException(AppErrors.INVALID_AMOCRM_CREDENTIALS);
      }
    }

    await this.upsertIntegration(userId, credentials, 'connected');
    await this.cache.del(`amo:status:${userId}`);

    return { message: 'amoCRM connected', subdomain: input.subdomain };
  }

  async getOAuthUrl(userId: string): Promise<{ url: string }> {
    if (this.config.get<boolean>('AMOCRM_MOCK', true)) {
      return {
        url: `${this.config.get('APP_URL')}/integrations/amocrm?mock=true`,
      };
    }

    const state = randomBytes(24).toString('hex');
    await this.cache.set(`amo:oauth:state:${state}`, userId, 10 * 60 * 1000);

    return { url: this.amoOAuth.buildAuthorizeUrl(state) };
  }

  async handleOAuthCallback(code: string, state: string, referer?: string) {
    const userId = await this.cache.get<string>(`amo:oauth:state:${state}`);
    if (!userId) {
      throw new BadRequestException(AppErrors.INVALID_OAUTH_STATE);
    }

    const subdomain = this.extractSubdomain(referer);
    const credentials = this.config.get<boolean>('AMOCRM_MOCK', true)
      ? {
          subdomain: subdomain ?? 'mock',
          accessToken: `mock-oauth-${userId}`,
          refreshToken: `mock-oauth-refresh-${userId}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      : await this.amoOAuth.exchangeCode(code, subdomain ?? '');

    await this.upsertIntegration(userId, credentials, 'connected');
    await this.cache.del(`amo:oauth:state:${state}`);
    await this.cache.invalidateUserCrmCache(userId);

    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:5173');
    return { redirectUrl: `${appUrl}/integrations/amocrm?connected=true` };
  }

  async testAmoCrm(userId: string) {
    const credentials = await this.getAmoCredentials(userId);
    const ok = await this.amoCrm.testConnection(credentials);
    return { ok };
  }

  async disconnectAmoCrm(userId: string) {
    await this.prisma.integration.deleteMany({
      where: { userId, provider: AMOCRM_PROVIDER },
    });
    await this.cache.invalidateUserCrmCache(userId);
    return { message: 'amoCRM disconnected' };
  }

  async getAmoCredentials(userId: string): Promise<AmoCrmCredentials> {
    const integration = await this.prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: AMOCRM_PROVIDER } },
    });

    if (!integration) {
      throw new NotFoundException(AppErrors.AMOCRM_INTEGRATION_NOT_FOUND);
    }

    return this.decryptCredentials(integration);
  }

  private async upsertIntegration(
    userId: string,
    credentials: AmoCrmCredentials,
    status: string,
  ) {
    const encrypted = this.encryption.encryptJson(credentials);

    await this.prisma.integration.upsert({
      where: { userId_provider: { userId, provider: AMOCRM_PROVIDER } },
      create: {
        userId,
        provider: AMOCRM_PROVIDER,
        status,
        credentials: { encrypted },
        metadata: { subdomain: credentials.subdomain },
      },
      update: {
        status,
        credentials: { encrypted },
        metadata: { subdomain: credentials.subdomain },
      },
    });
  }

  private decryptCredentials(integration: Integration): AmoCrmCredentials {
    const payload = integration.credentials as { encrypted?: string };
    if (!payload.encrypted) {
      throw new BadRequestException(AppErrors.INTEGRATION_CREDENTIALS_INVALID);
    }
    return this.encryption.decryptJson<AmoCrmCredentials>(payload.encrypted);
  }

  private toAmoStatus(integration: Integration | null): AmoCrmIntegrationStatus {
    if (!integration) {
      return {
        connected: false,
        provider: 'amocrm',
        status: 'disconnected',
      };
    }

    const metadata = integration.metadata as { subdomain?: string } | null;
    let expiresAt: string | undefined;
    try {
      expiresAt = this.decryptCredentials(integration).expiresAt;
    } catch {
      expiresAt = undefined;
    }

    return {
      connected: integration.status === 'connected',
      provider: 'amocrm',
      subdomain: metadata?.subdomain,
      status: integration.status,
      expiresAt,
    };
  }

  private extractSubdomain(referer?: string): string | undefined {
    if (!referer) {
      return undefined;
    }

    try {
      const host = new URL(referer).hostname;
      return host.split('.')[0];
    } catch {
      return undefined;
    }
  }
}
