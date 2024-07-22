import { ChatRoleType } from 'enums';
import { z } from 'zod';

import dbSchema from './db.schema';

export const MessageSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(ChatRoleType),
  content: z.string(),
  createdOn: z
    .date()
    .default(() => new Date())
    .optional(),
});

export const aiChatSchema = dbSchema.extend({
  title: z.string(),
  messages: z.array(MessageSchema).default([]),
  userId: z.string(),
  lastMessageOn: z.date().default(() => new Date()),
});
