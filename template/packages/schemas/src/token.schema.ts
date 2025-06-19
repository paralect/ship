import { TokenType } from 'enums';
import { z } from 'zod';

import dbSchema from './db.schema';

const baseTokenSchema = dbSchema.extend({
  userId: z.string(),
  value: z.string(),
});

export const tokenSchema = z.discriminatedUnion('type', [
  baseTokenSchema.extend({
    type: z.literal(TokenType.ACCESS),
    lastVerifiedOn: z.date(),
  }),
]);
