import _ from 'lodash';

import { accountUtils } from 'resources/account';
import { userService } from 'resources/users';

import { securityUtil } from 'utils';
import { createEndpoint } from 'routes/types';

import { updateUserSchema } from '../../users/user.schema';
import type { User } from 'types';

export const schema = updateUserSchema;

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
