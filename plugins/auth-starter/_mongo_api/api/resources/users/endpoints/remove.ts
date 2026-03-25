import { z } from 'zod';

import db from '@/db';
import { isAdmin, shouldExist } from '@/procedures';

export default isAdmin
  .input(z.object({ id: z.string() }))
  .use(shouldExist((id) => db.users.findOne({ _id: id }), 'User'))
  .output(z.object({}))
  .handler(async ({ input }) => {
    await db.users.deleteSoft({ _id: input.id });

    return {};
  });
