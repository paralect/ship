import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';

import { baseColumns } from '../base.schema';

export const users = pgTable('users', {
  ...baseColumns,
  id: text('id').primaryKey(),

  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),

  isAdmin: boolean('is_admin').default(false).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),

  avatarUrl: text('avatar_url'),

  lastRequestAt: timestamp('last_request_at', { withTimezone: true }),
});

export const emailSchema = z
  .email()
  .min(1, 'Email is required')
  .toLowerCase()
  .trim()
  .max(255, 'Email must be less than 255 characters.');

const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REGEX: /^(?=.*[a-z])(?=.*\d).+$/i,
};

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(PASSWORD_RULES.MIN_LENGTH, `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters.`)
  .max(PASSWORD_RULES.MAX_LENGTH, `Password must be less than ${PASSWORD_RULES.MAX_LENGTH} characters.`)
  .regex(
    PASSWORD_RULES.REGEX,
    `The password must contain ${PASSWORD_RULES.MIN_LENGTH} or more characters with at least one letter (a-z) and one number (0-9).`,
  );

const usersSchema = createSelectSchema(users, {
  fullName: (schema) => schema.min(1, 'Full name is required').max(128, 'Full name must be less than 128 characters.'),
  email: () => emailSchema,
});

export default usersSchema;

export const publicSchema = usersSchema;
