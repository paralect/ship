import { pgTable, text } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const aiChats = pgTable('ai_chats', {
  ...baseColumns,
  title: text('title').notNull().default('New Chat'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
