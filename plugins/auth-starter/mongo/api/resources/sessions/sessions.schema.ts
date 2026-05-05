import { z } from 'zod';

import { dbSchema } from '@/resources/base.schema';

const schema = dbSchema.extend({
  expiresAt: z.date(),
  token: z.string(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: z.string(),
});

export default schema;

export type Session = z.infer<typeof schema>;
