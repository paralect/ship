import { z } from 'zod';

import { USER_AVATAR } from 'app-constants';

import { emailSchema, fileSchema, passwordSchema } from './common.schema';
import dbSchema from './db.schema';

const oauthSchema = z.object({
  google: z
    .object({
      userId: z.string().nonempty('Google user ID is required'),
      connectedOn: z.date(),
    })
    .optional(),
});

export const userSchema = dbSchema
  .extend({
    firstName: z.string().nonempty('First name is required').max(128, 'First name must be less than 128 characters.'),
    lastName: z.string().nonempty('Last name is required').max(128, 'Last name must be less than 128 characters.'),

    email: emailSchema,
    passwordHash: z.string().optional(),

    isEmailVerified: z.boolean().default(false),

    avatarUrl: z.string().nullable().optional(),

    oauth: oauthSchema.optional(),

    lastRequest: z.date().optional(),
  })
  .strip();

export const updateUserSchema = userSchema
  .pick({ firstName: true, lastName: true })
  .extend({
    password: z.union([
      passwordSchema,
      z.literal(''), // Allow empty string when password is unchanged on the front-end
    ]),
    avatar: z.union([
      fileSchema(USER_AVATAR.MAX_FILE_SIZE, USER_AVATAR.ACCEPTED_FILE_TYPES).nullable(),
      z.literal(''), // Allow empty string to indicate removal
    ]),
  })
  .partial();
