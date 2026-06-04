import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import shouldOwnChat from '@/resources/ai-chats/middlewares/should-own-chat';
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

export default endpoint
  .use(isAuthorized)
  .route({ method: 'POST', path: '/ai-chats/{chatId}/messages' })
  .input(inputSchema)
  .use(shouldOwnChat)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
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

    if (context.chat.title === 'New Chat') {
      const title = input.content.slice(0, 50) + (input.content.length > 50 ? '...' : '');
      await db.aiChats.updateOne({ id: input.chatId }, { title });
    }

    return {
      userMessage: { id: userMessage.id, role: 'user' as const, content: userMessage.content },
      assistantMessage: { id: assistantMessage.id, role: 'assistant' as const, content: assistantMessage.content },
    };
  });
