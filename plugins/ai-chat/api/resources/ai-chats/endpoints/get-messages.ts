import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import shouldOwnChat from '@/resources/ai-chats/middlewares/should-own-chat';
import { z } from 'zod';

const inputSchema = z.object({
  chatId: z.string(),
});

const outputSchema = z.array(
  z.object({
    id: z.string(),
    chatId: z.string(),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    createdAt: z.string().nullable(),
  }),
);

export default endpoint
  .use(isAuthorized)
  .route({ method: 'GET', path: '/ai-chats/{chatId}/messages' })
  .input(inputSchema)
  .use(shouldOwnChat)
  .output(outputSchema)
  .handler(async ({ input }) => {
    const messages = await db.aiMessages.find({
      where: { chatId: input.chatId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt?.toISOString() ?? null,
    }));
  });
