import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({
  chatId: z.string(),
});

export default isAuthorized
  .input(inputSchema)
  .output(z.void())
  .handler(async ({ context, input }) => {
    const chat = await db.aiChats.findFirst({
      where: { id: input.chatId, userId: context.user.id, deletedAt: null },
    });

    if (!chat) {
      throw new ORPCError('NOT_FOUND', { message: 'Chat not found' });
    }

    await db.aiMessages.deleteMany({ chatId: input.chatId });
    await db.aiChats.deleteOne({ id: input.chatId });
  });
