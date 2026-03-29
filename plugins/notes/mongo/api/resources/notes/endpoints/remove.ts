import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({
  id: z.string(),
});

export default isAuthorized.input(inputSchema).handler(async ({ context, input }) => {
  const note = await db.notes.findOne({ _id: input.id, userId: context.user._id });

  if (!note) {
    throw new ORPCError('NOT_FOUND', { message: 'Note not found' });
  }

  await db.notes.deleteOne({ _id: input.id });
});
