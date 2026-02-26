import { z } from "zod";

import { dbSchema } from "../base.schema";

export const chatSchema = dbSchema.extend({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1).max(255).default("New Chat"),
});

export type Chat = z.infer<typeof chatSchema>;
