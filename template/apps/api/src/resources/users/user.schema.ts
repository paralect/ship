import { z } from 'zod';

import { dbSchema, emailSchema, passwordSchema } from '../base.schema';

const oauthSchema = z.object({
  google: z
    .object({
      userId: z.string().min(1, 'Google user ID is required'),
      connectedOn: z.date(),
    })
    .optional(),
});

export const userSchema = dbSchema.extend({
  firstName: z.string().min(1, 'First name is required').max(128, 'First name must be less than 128 characters.'),
  lastName: z.string().min(1, 'Last name is required').max(128, 'Last name must be less than 128 characters.'),

  email: emailSchema,
  passwordHash: z.string().optional(),

  isEmailVerified: z.boolean().default(false),

  avatarUrl: z.string().nullable().optional(),

  oauth: oauthSchema.optional(),

  lastRequest: z.date().optional(),
});

export const userPublicSchema = userSchema.omit({
  passwordHash: true,
});

export const updateUserSchema = userSchema
  .pick({ firstName: true, lastName: true })
  .extend({
    password: z.union([
      passwordSchema,
      z.literal(''),
    ]),
    avatar: z.union([
      z.any(), // File validation handled at runtime (browser File or formidable File)
      z.literal(''),
    ]).nullable(),
  })
  .partial();
