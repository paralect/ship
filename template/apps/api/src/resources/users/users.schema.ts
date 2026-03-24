import { z } from 'zod';

import { dbSchema, emailSchema } from '../base.schema';

const schema = dbSchema.extend({
  firstName: z.string().min(1, 'First name is required').max(128, 'First name must be less than 128 characters.'),
  lastName: z.string().min(1, 'Last name is required').max(128, 'Last name must be less than 128 characters.'),

  email: emailSchema,
  passwordHash: z.string().optional(),

  isEmailVerified: z.boolean().default(false),

  avatarUrl: z.string().nullable().optional(),

  oauth: z
    .object({
      google: z
        .object({
          userId: z.string().min(1, 'Google user ID is required'),
          connectedOn: z.date(),
        })
        .optional(),
    })
    .optional(),

  lastRequest: z.date().optional(),
});

export default schema;

export type User = z.infer<typeof schema>;

export const publicSchema = schema.omit({
  passwordHash: true,
});

export const indexes = [
  { fields: { email: 1 }, options: { unique: true } },
] as const;
