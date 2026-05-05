import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

const outputSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string().nullable(),
});

export default isAuthorized
  .route({ method: 'POST', path: '/ai-chats' })
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
    const chat = await db.aiChats.insertOne({
      userId: context.user.id,
      title: input.title || 'New Chat',
    });

    return {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt?.toISOString() ?? null,
    };
  });
