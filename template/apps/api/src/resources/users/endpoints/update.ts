import { z } from 'zod';

import usersSchema, { publicSchema } from '../users.schema';

import { usersService } from '@/db';
import { isAdmin, withEntity } from '@/procedures';

export default isAdmin
  .input(
    z.object({
      id: z.string(),
      data: usersSchema.pick({ firstName: true, lastName: true, email: true }),
    }),
  )
  .use(withEntity((id) => usersService.findOne({ _id: id }), 'User'))
  .output(publicSchema)
  .handler(async ({ input }) => {
    const { id, data } = input;

    const nonEmptyValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) nonEmptyValues[key] = value;
    }

    const updatedUser = await usersService.updateOne({ _id: id }, () => nonEmptyValues);

    return updatedUser!;
  });
