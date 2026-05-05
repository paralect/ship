import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';
import { z } from 'zod';
import { generateResponse } from '@ship/ai';

const inputSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1),
});

const outputSchema = z.object({
  userMessage: z.object({
    id: z.string(),
    role: z.literal('user'),
    content: z.string(),
  }),
  assistantMessage: z.object({
    id: z.string(),
    role: z.literal('assistant'),
    content: z.string(),
  }),
});

export default isAuthorized
  .route({ method: 'POST', path: '/ai-chats/{chatId}/messages' })
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
    const chat = await db.aiChats.findFirst({
      where: { id: input.chatId, userId: context.user.id, deletedAt: null },
    });

    if (!chat) {
      throw new ORPCError('NOT_FOUND', { message: 'Chat not found' });
    }

    const userMessage = await db.aiMessages.insertOne({
      chatId: input.chatId,
      role: 'user',
      content: input.content,
    });

    const allMessages = await db.aiMessages.find({
      where: { chatId: input.chatId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    const aiMessages = allMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const responseText = await generateResponse(aiMessages);

    const assistantMessage = await db.aiMessages.insertOne({
      chatId: input.chatId,
      role: 'assistant',
      content: responseText,
    });

    if (chat.title === 'New Chat') {
      const title = input.content.slice(0, 50) + (input.content.length > 50 ? '...' : '');
      await db.aiChats.updateOne({ id: input.chatId }, { title });
    }

    return {
      userMessage: { id: userMessage.id, role: 'user' as const, content: userMessage.content },
      assistantMessage: { id: assistantMessage.id, role: 'assistant' as const, content: assistantMessage.content },
    };
  });
