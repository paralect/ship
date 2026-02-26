import { z } from 'zod';

import { dbSchema } from '../base.schema';

export const messageRoleSchema = z.enum(['user', 'assistant']);

export const messageSchema = dbSchema.extend({
  chatId: z.string().min(1, 'Chat ID is required'),
  role: messageRoleSchema,
  content: z.string().min(1, 'Content is required'),
});

export type Message = z.infer<typeof messageSchema>;
export type MessageRole = z.infer<typeof messageRoleSchema>;
