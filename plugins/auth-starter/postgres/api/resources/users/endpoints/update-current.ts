import { z } from 'zod';

import db from '@/db';
import { isAuthorized } from '@/procedures';
import removeAvatar from '@/resources/users/methods/remove-avatar';
import uploadAvatar from '@/resources/users/methods/upload-avatar';
import usersSchema, { publicSchema } from '@/resources/users/users.schema';

export default isAuthorized
  .input(
    usersSchema
      .pick({ fullName: true })
      .extend({
        avatar: z.union([z.any(), z.literal('')]).nullable(),
      })
      .partial(),
  )
  .output(publicSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { avatar, ...rest } = input;

    const dataToUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) dataToUpdate[key] = value;
    }

    if (avatar === '') {
      await removeAvatar({ user });
      dataToUpdate.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      dataToUpdate.avatarUrl = await uploadAvatar({ user, file: avatar });
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return user;
    }

    const updatedUser = await db.users.updateOne({ id: user.id }, dataToUpdate);

    return updatedUser!;
  });
