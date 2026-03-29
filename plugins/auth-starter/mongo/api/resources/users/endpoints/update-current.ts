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

    const updateData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) updateData[key] = value;
    }

    if (avatar === '') {
      await removeAvatar({ user });
      updateData.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      updateData.avatarUrl = await uploadAvatar({ user, file: avatar });
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    return db.users.updateOne({ _id: user._id }, () => updateData).then((u: typeof user) => u!);
  });
