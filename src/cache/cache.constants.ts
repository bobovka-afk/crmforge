export const CACHE_TTL = {
  DEFAULT_MS: 5 * 60 * 1000,
  AMO_STATUS_MS: 5 * 60 * 1000,
  AMO_LEADS_MS: 10 * 60 * 1000,
} as const;

export const cacheKeys = {
  amoLeads: (userId: string, page: number) => `amo:leads:${userId}:${page}`,
  amoStatus: (userId: string) => `amo:status:${userId}`,
  authBlacklist: (jti: string) => `auth:blacklist:${jti}`,
  amoLeadsPattern: (userId: string) => `amo:leads:${userId}:*`,
  amoUserPattern: (userId: string) => `amo:*:${userId}*`,
} as const;
