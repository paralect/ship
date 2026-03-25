import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),

  isAdmin: boolean('is_admin').default(false).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),

  avatarUrl: text('avatar_url'),

  googleUserId: text('google_user_id'),
  googleConnectedOn: timestamp('google_connected_on', { withTimezone: true }),

  lastRequest: timestamp('last_request', { withTimezone: true }),

  createdOn: timestamp('created_on', { withTimezone: true }).defaultNow(),
  updatedOn: timestamp('updated_on', { withTimezone: true }),
  deletedOn: timestamp('deleted_on', { withTimezone: true }),
});
