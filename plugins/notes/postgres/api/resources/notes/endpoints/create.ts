import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({
  text: z.string().min(1).max(1000),
});

const outputSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string().nullable(),
});

export default isAuthorized
  .route({ method: 'POST', path: '/notes' })
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
  const note = await db.notes.insertOne({
    userId: context.user.id,
    text: input.text,
  });

  return {
    id: note.id,
    text: note.text,
    createdAt: note.createdAt?.toISOString() ?? null,
  };
});
