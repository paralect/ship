import { z } from 'zod';

import { aiChatSchema, MessageSchema } from 'schemas';

export type AIChat = z.infer<typeof aiChatSchema>;
export type AIMessage = z.input<typeof MessageSchema>;
