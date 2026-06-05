import { z } from 'zod';

import { dbSchema, emailSchema } from '../base.schema';

const schema = dbSchema.extend({
  isAdmin: z.boolean().default(false),

  fullName: z.string().min(1, 'Full name is required').max(128, 'Full name must be less than 128 characters.'),

  email: emailSchema,

  isEmailVerified: z.boolean().default(false),

  avatarUrl: z.string().nullable().optional(),

  lastRequestAt: z.date().optional(),
});

export default schema;

export type User = z.infer<typeof schema>;

export const publicSchema = schema;

export const indexes = [{ fields: { email: 1 }, options: { unique: true } }] as const;
