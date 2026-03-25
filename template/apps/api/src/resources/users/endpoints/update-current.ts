import { z } from 'zod';

import db from '@/db';
import { isAuthorized } from '@/procedures';
import removeAvatar from '@/resources/auth/methods/remove-avatar';
import uploadAvatar from '@/resources/auth/methods/upload-avatar';
import usersSchema, { passwordSchema, publicSchema } from '@/resources/users/drizzle.schema';
import { securityUtil } from '@/utils';

export default isAuthorized
  .input(
    usersSchema
      .pick({ firstName: true, lastName: true })
      .extend({
        password: z.union([passwordSchema, z.literal('')]),
        avatar: z.union([z.any(), z.literal('')]).nullable(),
      })
      .partial(),
  )
  .output(publicSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { password, avatar, ...rest } = input;

    const dataToUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) dataToUpdate[key] = value;
    }

    if (password) {
      dataToUpdate.passwordHash = await securityUtil.hashPassword(password);
    }

    if (avatar === '') {
      await removeAvatar(user);
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
