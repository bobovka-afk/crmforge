export interface ExternalLead {
  externalId: string;
  title: string;
  amount?: number;
  currency?: string;
  status: string;
  stage?: string;
  contactName?: string;
  rawPayload?: Record<string, unknown>;
}

export interface FetchLeadsParams {
  userId: string;
  page: number;
  limit: number;
  credentials?: Record<string, unknown>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface CrmProvider {
  testConnection(credentials: unknown): Promise<boolean>;
  fetchLeads(params: FetchLeadsParams): Promise<ExternalLead[]>;
  refreshTokensIfNeeded(
    credentials: Record<string, unknown>,
  ): Promise<TokenPair>;
}
