import { admin, withEntity } from 'procedures';
import { z } from 'zod';

import { userService } from '..';

const emptyOutput = z.object({});

export default admin
  .input(z.object({ id: z.string() }))
  .use(withEntity((id) => userService.findOne({ _id: id }), 'User'))
  .output(emptyOutput)
  .handler(async ({ input }) => {
    await userService.deleteSoft({ _id: input.id });

    return {};
  });
