import { authed } from 'procedures';
import { z } from 'zod';

import removeAvatar from 'resources/auth/methods/removeAvatar';
import uploadAvatar from 'resources/auth/methods/uploadAvatar';
import { passwordSchema } from 'resources/base.schema';
import usersSchema, { publicSchema } from 'resources/users/users.schema';

import { securityUtil } from 'utils';

import { usersService } from 'db';

export default authed
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

    const updateData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) updateData[key] = value;
    }

    if (password) {
      updateData.passwordHash = await securityUtil.hashPassword(password);
    }

    if (avatar === '') {
      await removeAvatar(user);
      updateData.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      updateData.avatarUrl = await uploadAvatar(user, avatar);
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    return usersService.updateOne({ _id: user._id }, () => updateData).then((u) => u!);
  });
