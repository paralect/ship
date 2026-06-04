import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import shouldOwnChat from '@/resources/ai-chats/middlewares/should-own-chat';
import { z } from 'zod';

const inputSchema = z.object({
  chatId: z.string(),
});

export default endpoint
  .use(isAuthorized)
  .route({ method: 'DELETE', path: '/ai-chats/{chatId}' })
  .input(inputSchema)
  .use(shouldOwnChat)
  .output(z.void())
  .handler(async ({ input }) => {
    await db.aiMessages.deleteMany({ chatId: input.chatId });
    await db.aiChats.deleteOne({ id: input.chatId });
  });
