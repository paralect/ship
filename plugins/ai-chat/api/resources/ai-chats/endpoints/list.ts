import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const outputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
  }),
);

export default isAuthorized.output(outputSchema).handler(async ({ context }) => {
  const chats = await db.aiChats.find({
    where: { userId: context.user.id, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
  });

  return chats.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt?.toISOString() ?? null,
    updatedAt: c.updatedAt?.toISOString() ?? null,
  }));
});
