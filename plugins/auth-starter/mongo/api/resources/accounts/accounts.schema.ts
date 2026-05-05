import { z } from 'zod';

import { dbSchema } from '@/resources/base.schema';

const schema = dbSchema.extend({
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: z.date().nullable().optional(),
  refreshTokenExpiresAt: z.date().nullable().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
});

export default schema;

export type Account = z.infer<typeof schema>;
