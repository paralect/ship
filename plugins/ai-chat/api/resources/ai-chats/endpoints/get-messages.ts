import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';
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

export default isAuthorized
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
    const chat = await db.aiChats.findFirst({
      where: { id: input.chatId, userId: context.user.id, deletedAt: null },
    });

    if (!chat) {
      throw new ORPCError('NOT_FOUND', { message: 'Chat not found' });
    }

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
