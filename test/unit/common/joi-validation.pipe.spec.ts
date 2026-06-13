import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../../../src/common/pipes/joi-validation.pipe';

describe('JoiValidationPipe', () => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  it('returns validated value', () => {
    const pipe = new JoiValidationPipe(schema);
    const result = pipe.transform({ email: 'test@example.com' }, { type: 'body' });
    expect(result).toEqual({ email: 'test@example.com' });
  });

  it('throws BadRequestException on invalid input', () => {
    const pipe = new JoiValidationPipe(schema);
    expect(() => pipe.transform({ email: 'bad' }, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });
});
