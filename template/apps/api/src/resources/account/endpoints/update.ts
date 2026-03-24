import { authed } from 'procedures';
import { z } from 'zod';

import { passwordSchema } from 'resources/base.schema';
import usersSchema, { publicSchema } from 'resources/users/users.schema';
import getPublic from 'resources/users/methods/getPublic';
import { usersService } from 'db';

import { securityUtil } from 'utils';

import removeAvatar from 'resources/account/methods/removeAvatar';
import uploadAvatar from 'resources/account/methods/uploadAvatar';


const publicUserOutput = publicSchema;

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
      await removeAvatar(user);
      updateData.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      updateData.avatarUrl = await uploadAvatar(user, avatar);
    }

    if (Object.keys(updateData).length === 0) {
      return getPublic(user);
    }

    return usersService.updateOne({ _id: user._id }, () => updateData).then((u) => getPublic(u)!);
  });
