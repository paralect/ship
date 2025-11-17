import { TokenType } from 'enums';
import { z } from 'zod';

import dbSchema from './db.schema';

export const tokenSchema = dbSchema.extend({
  value: z.string(),
  userId: z.string(),
  type: z.enum(TokenType),
  expiresOn: z.date(),
});
