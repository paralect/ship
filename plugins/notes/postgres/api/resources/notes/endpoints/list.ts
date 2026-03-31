import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const outputSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    createdAt: z.string().nullable(),
  }),
);

export default isAuthorized
  .route({ method: 'GET', path: '/notes' })
  .output(outputSchema)
  .handler(async ({ context }) => {
  const results = await db.notes.find({ where: { userId: context.user.id, deletedAt: null } });

  return results.map((n) => ({
    id: n.id,
    text: n.text,
    createdAt: n.createdAt?.toISOString() ?? null,
  }));
});
