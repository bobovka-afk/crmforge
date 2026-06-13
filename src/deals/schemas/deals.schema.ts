import * as Joi from 'joi';

export const listDealsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().optional(),
  search: Joi.string().allow('').optional(),
  sort: Joi.string()
    .valid('createdAt', 'amount', 'syncedAt')
    .default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

export const createDealSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  amount: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).default('RUB'),
  status: Joi.string().min(1).max(50).required(),
  stage: Joi.string().max(100).optional(),
  contactName: Joi.string().max(255).optional(),
});

export const updateDealSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  amount: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  status: Joi.string().min(1).max(50).optional(),
  stage: Joi.string().max(100).optional(),
  contactName: Joi.string().max(255).optional(),
}).min(1);
