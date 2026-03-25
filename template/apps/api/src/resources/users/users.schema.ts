import { z } from 'zod';

import { dbSchema, emailSchema } from '../base.schema';

const schema = dbSchema.extend({
  isAdmin: z.boolean().default(false),

  firstName: z.string().min(1, 'First name is required').max(128, 'First name must be less than 128 characters.'),
  lastName: z.string().min(1, 'Last name is required').max(128, 'Last name must be less than 128 characters.'),

  email: emailSchema,
  passwordHash: z.string().nullable(),

  isEmailVerified: z.boolean().default(false),

  avatarUrl: z.string().nullable(),

  googleUserId: z.string().nullable(),
  googleConnectedOn: z.date().nullable(),

  lastRequest: z.date().nullable(),
});

export default schema;

export type User = z.infer<typeof schema>;

export const publicSchema = schema.omit({
  passwordHash: true,
});
