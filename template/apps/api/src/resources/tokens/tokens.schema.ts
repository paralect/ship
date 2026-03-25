import { z } from 'zod';

import { dbSchema } from '../base.schema';

export enum TokenType {
  ACCESS = 'access',
  EMAIL_VERIFICATION = 'email-verification',
  RESET_PASSWORD = 'reset-password',
}

const schema = dbSchema.extend({
  value: z.string(),
  userId: z.string(),
  type: z.enum([TokenType.ACCESS, TokenType.EMAIL_VERIFICATION, TokenType.RESET_PASSWORD]),
  expiresOn: z.date(),
});

export default schema;

export type Token = z.infer<typeof schema>;

export const indexes = [
  { fields: { expiresOn: 1 }, options: { expireAfterSeconds: 0 } },
  { fields: { userId: 1, type: 1 } },
] as const;
