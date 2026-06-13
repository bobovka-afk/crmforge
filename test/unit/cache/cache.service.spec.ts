import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../../../src/cache/cache.service';
import { RedisService } from '../../../src/redis/redis.service';

describe('CacheService', () => {
  let service: CacheService;
  const cache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const redisClient = {
    status: 'ready',
    connect: jest.fn(),
    scan: jest.fn().mockResolvedValue(['0', []]),
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useValue: cache },
        {
          provide: RedisService,
          useValue: { getClient: () => redisClient },
        },
      ],
    }).compile();

    service = module.get(CacheService);
  });

  it('returns cached value on hit', async () => {
    cache.get.mockResolvedValue({ ok: true });

    const result = await service.get('test-key');

    expect(result).toEqual({ ok: true });
    expect(cache.get).toHaveBeenCalledWith('test-key');
  });

  it('stores amo leads with 10 min ttl', async () => {
    await service.setAmoLeads('user-1', 2, [{ id: 1 }]);

    expect(cache.set).toHaveBeenCalledWith(
      'amo:leads:user-1:2',
      [{ id: 1 }],
      600000,
    );
  });

  it('blacklists access token jti', async () => {
    await service.blacklistAccessToken('jti-1', 900000);

    expect(cache.set).toHaveBeenCalledWith('auth:blacklist:jti-1', true, 900000);
  });
});
