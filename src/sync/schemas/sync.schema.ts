import * as Joi from 'joi';

export const triggerSyncSchema = Joi.object({
  full: Joi.boolean().default(true),
});
