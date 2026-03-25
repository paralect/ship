import { z } from 'zod';

import { dbSchema } from '../base.schema';

const tokenTypes = ['access', 'email-verification', 'reset-password'] as const;
export type TokenType = (typeof tokenTypes)[number];

const schema = dbSchema.extend({
  value: z.string(),
  userId: z.string(),
  type: z.enum(tokenTypes),
  expiresOn: z.date(),
});

export default schema;

export type Token = z.infer<typeof schema>;

export const indexes = [
  { fields: { expiresOn: 1 }, options: { expireAfterSeconds: 0 } },
  { fields: { userId: 1, type: 1 } },
] as const;
