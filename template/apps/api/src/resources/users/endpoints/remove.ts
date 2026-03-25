import { z } from 'zod';

import db from '@/db';
import { isAdmin, shouldExist } from '@/procedures';

export default isAdmin
  .input(z.object({ id: z.string() }))
  .use(
    shouldExist(async (id) => {
      const user = await db.users.findFirst({ where: { id } });
      return user ?? null;
    }, 'User'),
  )
  .output(z.object({}))
  .handler(async ({ input }) => {
    await db.users.updateOne({ id: input.id }, { deletedOn: new Date() });

    return {};
  });
