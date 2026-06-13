import { ConfigService } from '@nestjs/config';
import { buildPinoConfig } from '../../../src/config/pino.config';

describe('buildPinoConfig', () => {
  const mockConfig = (values: Record<string, unknown>) =>
    ({
      get: (key: string, defaultValue?: unknown) =>
        values[key] ?? defaultValue,
    }) as ConfigService;

  it('returns silent logger in test env', () => {
    const config = buildPinoConfig(mockConfig({ NODE_ENV: 'test' }));
    expect(config.pinoHttp).toEqual({ level: 'silent' });
  });

  it('enables loki transport when LOKI_ENABLED and LOKI_URL are set', () => {
    const config = buildPinoConfig(
      mockConfig({
        NODE_ENV: 'development',
        LOKI_ENABLED: true,
        LOKI_URL: 'http://localhost:3100',
      }),
    );

    const pinoHttp = config.pinoHttp as {
      transport?: { target: string; options: Record<string, unknown> };
    };

    expect(pinoHttp.transport).toEqual({
      target: 'pino-loki',
      options: {
        host: 'http://localhost:3100',
        labels: { application: 'crmforge', env: 'development' },
        batching: true,
        interval: 1,
      },
    });
  });

  it('uses stdout when loki is disabled', () => {
    const config = buildPinoConfig(
      mockConfig({
        NODE_ENV: 'development',
        LOKI_ENABLED: false,
        LOKI_URL: 'http://localhost:3100',
      }),
    );

    const pinoHttp = config.pinoHttp as { transport?: unknown };

    expect(pinoHttp.transport).toBeUndefined();
  });
});
