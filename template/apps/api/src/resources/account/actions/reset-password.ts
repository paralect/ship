import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import db from 'db';

import { resetPasswordSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, ResetPasswordParams, User } from 'types';

interface ValidatedData extends ResetPasswordParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  if (!user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  await db.withTransaction((session) =>
    Promise.all([
      userService.updateOne(
        { _id: user._id },
        () => ({
          passwordHash,
          resetPasswordToken: null,
        }),
        {},
        { session },
      ),
      tokenService.invalidateUserTokens(user._id, session),
    ]),
  );

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.put('/reset-password', validateMiddleware(resetPasswordSchema), validator, handler);
};
