import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const tokenTypeEnum = pgEnum('token_type', ['access', 'email-verification', 'reset-password']);

export const tokens = pgTable('tokens', {
  ...baseColumns,

  value: text('value').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  type: tokenTypeEnum('type').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
