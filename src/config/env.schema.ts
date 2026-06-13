import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  APP_URL: Joi.string().uri().default('http://localhost:5173'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),

  DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  JWT_ACCESS_SECRET: Joi.string().min(16).default('dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: Joi.string().min(16).default('dev-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  GOOGLE_CLIENT_ID: Joi.string().allow('').default(''),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').default(''),
  GOOGLE_CALLBACK_URL: Joi.string()
    .uri()
    .default('http://localhost:3000/api/auth/google/callback'),

  SENDGRID_API_KEY: Joi.string().allow('').default(''),
  SENDGRID_FROM_EMAIL: Joi.string()
    .email({ tlds: { allow: ['local', 'com', 'net', 'org', 'dev', 'io'] } })
    .default('noreply@crmforge.local'),
  MAIL_MOCK: Joi.boolean().default(true),

  ENCRYPTION_KEY: Joi.string().allow('').default(''),

  AMOCRM_MOCK: Joi.boolean().default(true),
  AMOCRM_CLIENT_ID: Joi.string().allow('').default(''),
  AMOCRM_CLIENT_SECRET: Joi.string().allow('').default(''),
  AMOCRM_REDIRECT_URI: Joi.string()
    .uri()
    .default('http://localhost:3000/api/integrations/amocrm/oauth/callback'),

  LOKI_URL: Joi.string().uri().allow('').default(''),
  LOKI_ENABLED: Joi.boolean().default(false),
});
