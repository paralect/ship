import { pgTable, text } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const notes = pgTable('notes', {
  ...baseColumns,

  text: text('text').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
