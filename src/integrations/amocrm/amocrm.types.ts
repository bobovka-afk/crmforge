export interface AmoCrmCredentials {
  subdomain: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  clientId?: string;
  clientSecret?: string;
}

export interface AmoCrmIntegrationStatus {
  connected: boolean;
  provider: 'amocrm';
  subdomain?: string;
  status: string;
  expiresAt?: string;
}
