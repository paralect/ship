import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from '../users/drizzle.schema';

export const tokenTypeEnum = pgEnum('token_type', ['access', 'email-verification', 'reset-password']);

export const tokens = pgTable('tokens', {
  id: uuid('id').defaultRandom().primaryKey(),

  value: text('value').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  type: tokenTypeEnum('type').notNull(),
  expiresOn: timestamp('expires_on', { withTimezone: true }).notNull(),

  createdOn: timestamp('created_on', { withTimezone: true }).defaultNow(),
  updatedOn: timestamp('updated_on', { withTimezone: true }),
  deletedOn: timestamp('deleted_on', { withTimezone: true }),
});
