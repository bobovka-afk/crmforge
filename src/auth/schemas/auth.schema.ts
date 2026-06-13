import * as Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required(),
  name: Joi.string().min(1).max(100).optional(),
  locale: Joi.string().valid('ru', 'en').default('ru'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyEmailQuerySchema = Joi.object({
  token: Joi.string().required(),
});
