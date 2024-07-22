import { z } from 'zod';

import { aiChatSchema, userSchema } from 'schemas';

export type User = z.infer<typeof userSchema>;
export type AiChat = z.infer<typeof aiChatSchema>;
