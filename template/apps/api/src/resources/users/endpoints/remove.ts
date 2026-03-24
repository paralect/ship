import { admin, withEntity } from 'procedures';
import { z } from 'zod';

import { usersService } from 'db';

const emptyOutput = z.object({});

export default admin
  .input(z.object({ id: z.string() }))
  .use(withEntity((id) => usersService.findOne({ _id: id }), 'User'))
  .output(emptyOutput)
  .handler(async ({ input }) => {
    await usersService.deleteSoft({ _id: input.id });

    return {};
  });
