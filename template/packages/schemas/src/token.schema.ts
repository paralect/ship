import { TokenType } from 'enums';
import { z } from 'zod';

import dbSchema from './db.schema';

export const tokenSchema = dbSchema
  .extend({
    type: z.nativeEnum(TokenType),
    value: z.string(),
    userId: z.string(),
  })
  .strip();
