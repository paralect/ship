import _ from 'lodash';

import { accountUtils } from 'resources/account';
import { userService } from 'resources/users';

import { securityUtil } from 'utils';
import { createEndpoint, createMiddleware } from 'routes/types';

import { updateUserSchema } from '../../users/user.schema';
import { AppKoaContext, UpdateUserParamsBackend, User } from 'types';

export const schema = updateUserSchema;

interface ValidatedData extends UpdateUserParamsBackend {
  passwordHash?: string;
}

const validator = createMiddleware(async (ctx, next) => {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  if (_.isEmpty(ctx.validatedData)) {
    ctx.body = userService.getPublic(user);
    return;
  }

  if (password) {
    ctx.validatedData.passwordHash = await securityUtil.hashPassword(password);

    delete ctx.validatedData.password;
  }

  await next();
});

export default createEndpoint({
  method: 'put',
  path: '/',
  schema,
  middlewares: [validator],

  async handler(ctx) {
    const typedCtx = ctx as AppKoaContext<ValidatedData>;
    const { avatar } = typedCtx.validatedData;
    const { user } = typedCtx.state;

    const nonEmptyValues = _.pickBy(typedCtx.validatedData, (value) => !_.isUndefined(value));
    const updateData: Partial<User> = _.omit(nonEmptyValues, 'avatar');

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
