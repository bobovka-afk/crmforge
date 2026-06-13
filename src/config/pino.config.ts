import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { IncomingMessage } from 'http';

type RequestWithUser = IncomingMessage & {
  id?: string;
  user?: { sub?: string };
};

export function buildPinoConfig(config: ConfigService): Params {
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const lokiEnabled = config.get<boolean>('LOKI_ENABLED', false);
  const lokiUrl = config.get<string>('LOKI_URL', '');

  if (nodeEnv === 'test') {
    return { pinoHttp: { level: 'silent' } };
  }

  const useLoki = lokiEnabled && lokiUrl.length > 0;

  return {
    pinoHttp: {
      level: nodeEnv === 'production' ? 'info' : 'debug',
      transport: useLoki
        ? {
            target: 'pino-loki',
            options: {
              host: lokiUrl,
              labels: { application: 'crmforge', env: nodeEnv },
              batching: true,
              interval: 1,
            },
          }
        : undefined,
      genReqId: (req) => {
        const header = req.headers['x-request-id'];
        return typeof header === 'string' ? header : randomUUID();
      },
      customProps: (req) => {
        const request = req as RequestWithUser;
        return {
          requestId: request.id,
          userId: request.user?.sub,
        };
      },
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
  };
}
