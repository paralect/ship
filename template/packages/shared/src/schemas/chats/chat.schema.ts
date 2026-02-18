import { z } from "zod";

import { dbSchema } from "../base.schema";

export const chatSchema = dbSchema.extend({
  userId: z.string(),
  title: z.string().optional(),
});

export type Chat = z.infer<typeof chatSchema>;

export const messageSchema = dbSchema.extend({
  chatId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
