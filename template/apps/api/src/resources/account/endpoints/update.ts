import _ from 'lodash';
import type { User } from 'shared';
import { passwordSchema, userSchema } from 'shared';
import { z } from 'zod';

import { accountUtils } from 'resources/account';
import { userService } from 'resources/users';

import { securityUtil } from 'utils';
import createEndpoint from 'routes/createEndpoint';

const schema = userSchema
  .pick({ firstName: true, lastName: true })
  .extend({
    password: z.union([passwordSchema, z.literal('')]),
    avatar: z.union([z.any(), z.literal('')]).nullable(),
  })
  .partial();

export default createEndpoint({
  method: 'put',
  path: '/',
  schema,

  async handler(ctx) {
    const { user } = ctx.state;

    if (_.isEmpty(ctx.validatedData)) {
      return userService.getPublic(user);
    }

    const { password, avatar, ...rest } = ctx.validatedData;

    const updateData: Partial<User> = _.pickBy(rest, (value) => !_.isUndefined(value));

    if (password) {
      updateData.passwordHash = await securityUtil.hashPassword(password);
    }

    if (avatar === '') {
      await accountUtils.removeAvatar(user);
      updateData.avatarUrl = null;
    }

    if (avatar) {
      updateData.avatarUrl = await accountUtils.uploadAvatar(user, avatar);
    }

    return userService.updateOne({ _id: user._id }, () => updateData).then(userService.getPublic);
  },
});
