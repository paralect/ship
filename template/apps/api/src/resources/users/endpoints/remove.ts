import { z } from 'zod';

import { usersService } from '@/db';
import { admin, withEntity } from '@/procedures';

export default admin
  .input(z.object({ id: z.string() }))
  .use(withEntity((id) => usersService.findOne({ _id: id }), 'User'))
  .output(z.object({}))
  .handler(async ({ input }) => {
    await usersService.deleteSoft({ _id: input.id });

    return {};
  });
