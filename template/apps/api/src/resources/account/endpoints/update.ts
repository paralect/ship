import { authed } from 'procedures';
import { z } from 'zod';

import { passwordSchema } from 'resources/base.schema';
import { userService } from 'resources/users';
import { userPublicSchema, userSchema } from 'resources/users/user.schema';

import { securityUtil } from 'utils';

import * as accountUtils from '../account.utils';

const publicUserOutput = userPublicSchema;

export default authed
  .input(
    userSchema
      .pick({ firstName: true, lastName: true })
      .extend({
        password: z.union([passwordSchema, z.literal('')]),
        avatar: z.union([z.any(), z.literal('')]).nullable(),
      })
      .partial(),
  )
  .output(publicUserOutput)
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
      await accountUtils.removeAvatar(user);
      updateData.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      updateData.avatarUrl = await accountUtils.uploadAvatar(user, avatar);
    }

    if (Object.keys(updateData).length === 0) {
      return userService.getPublic(user);
    }

    return userService.updateOne({ _id: user._id }, () => updateData).then((u) => userService.getPublic(u)!);
  });
