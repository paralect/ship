import { authed, withEntity } from 'procedures';
import { z } from 'zod';

import usersSchema, { publicSchema } from '../users.schema';
import getPublic from 'resources/users/methods/getPublic';
import { usersService } from 'db';


const publicUserOutput = publicSchema;

export default authed
  .input(
    z.object({
      id: z.string(),
      data: usersSchema.pick({ firstName: true, lastName: true, email: true }),
    }),
  )
  .use(withEntity((id) => usersService.findOne({ _id: id }), 'User'))
  .output(publicUserOutput)
  .handler(async ({ input }) => {
    const { id, data } = input;

    const nonEmptyValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) nonEmptyValues[key] = value;
    }

    const updatedUser = await usersService.updateOne({ _id: id }, () => nonEmptyValues);

    return getPublic(updatedUser)!;
  });
