import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CrmProvider,
  ExternalLead,
  FetchLeadsParams,
  TokenPair,
} from '../interfaces';
import { buildMockLeads, paginateMockLeads } from './amocrm.mock';
import { AmoCrmClient } from './amocrm.client';
import { AmoCrmCredentials } from './amocrm.types';

@Injectable()
export class AmoCrmProviderService implements CrmProvider {
  private readonly mockLeads = buildMockLeads(20);

  constructor(
    private readonly config: ConfigService,
    private readonly client: AmoCrmClient,
  ) {}

  private get isMock(): boolean {
    return this.config.get<boolean>('AMOCRM_MOCK', true);
  }

  async testConnection(credentials: unknown): Promise<boolean> {
    if (this.isMock) {
      const creds = credentials as unknown as AmoCrmCredentials;
      return Boolean(creds.subdomain && creds.accessToken);
    }
    return this.client.testConnection(credentials);
  }

  async fetchLeads(params: FetchLeadsParams): Promise<ExternalLead[]> {
    if (this.isMock) {
      return paginateMockLeads(this.mockLeads, params.page, params.limit);
    }

    const creds = params.credentials as unknown as AmoCrmCredentials;
    return this.client.fetchLeads({
      ...params,
      credentials: creds as unknown as Record<string, unknown>,
    });
  }

  async refreshTokensIfNeeded(
    credentials: Record<string, unknown>,
  ): Promise<TokenPair> {
    if (this.isMock) {
      const creds = credentials as unknown as AmoCrmCredentials;
      return {
        accessToken: creds.accessToken,
        refreshToken: creds.refreshToken,
        expiresAt: new Date(creds.expiresAt),
      };
    }

    return this.client.refreshTokensIfNeeded(credentials);
  }
}
