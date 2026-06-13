import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  CrmProvider,
  ExternalLead,
  FetchLeadsParams,
  TokenPair,
} from '../interfaces';
import { AmoCrmCredentials } from './amocrm.types';

@Injectable()
export class AmoCrmClient implements CrmProvider {
  async testConnection(credentials: unknown): Promise<boolean> {
    const creds = credentials as unknown as AmoCrmCredentials;
    const url = `https://${creds.subdomain}.amocrm.ru/api/v4/account`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${creds.accessToken}` },
      validateStatus: () => true,
    });
    return response.status === 200;
  }

  async fetchLeads(params: FetchLeadsParams): Promise<ExternalLead[]> {
    const creds = (params.credentials ?? params) as unknown as AmoCrmCredentials;
    const url = `https://${creds.subdomain}.amocrm.ru/api/v4/leads`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${creds.accessToken}` },
      params: { page: params.page, limit: params.limit },
    });

    const leads = response.data?._embedded?.leads ?? [];
    return leads.map((lead: Record<string, unknown>) => ({
      externalId: String(lead.id),
      title: String(lead.name ?? 'Untitled'),
      amount: Number(lead.price ?? 0),
      currency: 'RUB',
      status: String(lead.status_id ?? 'unknown'),
      contactName: undefined,
      rawPayload: lead,
    }));
  }

  async refreshTokensIfNeeded(
    credentials: Record<string, unknown>,
  ): Promise<TokenPair> {
    const creds = credentials as unknown as AmoCrmCredentials;
    const expiresAt = new Date(creds.expiresAt);
    if (expiresAt.getTime() > Date.now() + 60_000) {
      return {
        accessToken: creds.accessToken,
        refreshToken: creds.refreshToken,
        expiresAt,
      };
    }

    const response = await axios.post(
      `https://${creds.subdomain}.amocrm.ru/oauth2/access_token`,
      {
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: creds.refreshToken,
        redirect_uri: process.env.AMOCRM_REDIRECT_URI,
      },
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
    };
  }
}
