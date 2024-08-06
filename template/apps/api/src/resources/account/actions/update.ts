import _ from 'lodash';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import { updateUserSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, UpdateUserParams } from 'types';

interface ValidatedData extends UpdateUserParams {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  if (_.isEmpty(ctx.validatedData)) {
    ctx.body = userService.getPublic(user);

    return;
  }

  if (password) {
    ctx.validatedData.passwordHash = await securityUtil.getHash(password);

    delete ctx.validatedData.password;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  const updatedUser = await userService.updateOne({ _id: user._id }, () => _.pickBy(ctx.validatedData));

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(updateUserSchema), validator, handler);
};
