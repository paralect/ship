import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { aiChats } from './ai-chats.schema';

export const aiMessages = pgTable('ai_messages', {
  ...baseColumns,
  chatId: uuid('chat_id')
    .notNull()
    .references(() => aiChats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
});
