import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({
  id: z.string(),
});

export default isAuthorized
  .route({ method: 'DELETE', path: '/notes/{id}' })
  .input(inputSchema)
  .output(z.void())
  .handler(async ({ context, input }) => {
  const note = await db.notes.findFirst({ where: { id: input.id, userId: context.user.id, deletedAt: null } });

  if (!note) {
    throw new ORPCError('NOT_FOUND', { message: 'Note not found' });
  }

  await db.notes.deleteOne({ id: input.id });
});
