import * as Joi from 'joi';

export const connectAmoCrmSchema = Joi.object({
  subdomain: Joi.string().min(1).max(100).required(),
  clientId: Joi.string().allow('').optional(),
  clientSecret: Joi.string().allow('').optional(),
});

export const oauthCallbackQuerySchema = Joi.object({
  code: Joi.string().required(),
  state: Joi.string().required(),
  referer: Joi.string().optional(),
});
