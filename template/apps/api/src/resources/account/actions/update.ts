import _ from 'lodash';

import { accountUtils } from 'resources/account';
import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import { updateUserSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, UpdateUserParamsBackend, User } from 'types';

interface ValidatedData extends UpdateUserParamsBackend {
  passwordHash?: string;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
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
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { avatar } = ctx.validatedData;
  const { user } = ctx.state;

  const nonEmptyValues = _.pickBy(ctx.validatedData, (value) => !_.isUndefined(value));
  const updateData: Partial<User> = _.omit(nonEmptyValues, 'avatar');

  if (avatar === '') {
    await accountUtils.removeAvatar(user);

    updateData.avatarUrl = null;
  }

  if (avatar) {
    updateData.avatarUrl = await accountUtils.uploadAvatar(user, avatar);
  }

  ctx.body = await userService.updateOne({ _id: user._id }, () => updateData).then(userService.getPublic);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(updateUserSchema), validator, handler);
};
