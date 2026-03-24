import { authed, withEntity } from 'procedures';
import { z } from 'zod';

import { userPublicSchema, userSchema } from '../user.schema';
import { userService } from '..';

const publicUserOutput = userPublicSchema;

export default authed
  .input(
    z.object({
      id: z.string(),
      data: userSchema.pick({ firstName: true, lastName: true, email: true }),
    }),
  )
  .use(withEntity((id) => userService.findOne({ _id: id }), 'User'))
  .output(publicUserOutput)
  .handler(async ({ input }) => {
    const { id, data } = input;

    const nonEmptyValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) nonEmptyValues[key] = value;
    }

    const updatedUser = await userService.updateOne({ _id: id }, () => nonEmptyValues);

    return userService.getPublic(updatedUser)!;
  });
