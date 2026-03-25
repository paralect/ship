import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db, users } from '@/db';
import { isAdmin, shouldExist } from '@/procedures';

export default isAdmin
  .input(z.object({ id: z.string() }))
  .use(
    shouldExist(async (id) => {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user ?? null;
    }, 'User'),
  )
  .output(z.object({}))
  .handler(async ({ input }) => {
    await db.update(users).set({ deletedOn: new Date() }).where(eq(users.id, input.id));

    return {};
  });
