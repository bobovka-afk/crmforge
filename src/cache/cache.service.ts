import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisService } from '../redis/redis.service';
import { CACHE_TTL, cacheKeys } from './cache.constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly redis: RedisService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cache.get<T>(key);
    this.logger.debug(value === undefined ? `cache MISS ${key}` : `cache HIT ${key}`);
    return value;
  }

  async set<T>(
    key: string,
    value: T,
    ttlMs: number = CACHE_TTL.DEFAULT_MS,
  ): Promise<void> {
    await this.cache.set(key, value, ttlMs);
    this.logger.debug(`cache SET ${key} ttl=${ttlMs}ms`);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
    this.logger.debug(`cache DEL ${key}`);
  }

  async getAmoLeads<T>(userId: string, page: number): Promise<T | undefined> {
    return this.get<T>(cacheKeys.amoLeads(userId, page));
  }

  async setAmoLeads<T>(userId: string, page: number, value: T): Promise<void> {
    await this.set(cacheKeys.amoLeads(userId, page), value, CACHE_TTL.AMO_LEADS_MS);
  }

  async getAmoStatus<T>(userId: string): Promise<T | undefined> {
    return this.get<T>(cacheKeys.amoStatus(userId));
  }

  async setAmoStatus<T>(userId: string, value: T): Promise<void> {
    await this.set(cacheKeys.amoStatus(userId), value, CACHE_TTL.AMO_STATUS_MS);
  }

  async blacklistAccessToken(jti: string, ttlMs: number): Promise<void> {
    await this.set(cacheKeys.authBlacklist(jti), true, ttlMs);
  }

  async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
    const value = await this.get<boolean>(cacheKeys.authBlacklist(jti));
    return value === true;
  }

  async invalidateUserLeadsCache(userId: string): Promise<void> {
    await this.deleteByPattern(cacheKeys.amoLeadsPattern(userId));
  }

  async invalidateUserCrmCache(userId: string): Promise<void> {
    const client = this.redis.getClient();
    const patterns = [
      cacheKeys.amoLeadsPattern(userId),
      cacheKeys.amoStatus(userId),
    ];

    for (const pattern of patterns) {
      await this.deleteByPattern(pattern);
    }

    await client.del(cacheKeys.amoStatus(userId));
  }

  private async deleteByPattern(pattern: string): Promise<void> {
    const client = this.redis.getClient();
    if (client.status !== 'ready') {
      await client.connect();
    }

    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await client.del(...keys);
        this.logger.debug(`cache DEL pattern ${pattern} keys=${keys.length}`);
      }
    } while (cursor !== '0');
  }
}
