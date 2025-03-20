import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import { resetPasswordSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, ResetPasswordParams, User } from 'types';
import { database } from 'database';

interface ValidatedData extends ResetPasswordParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const user = await userService.findUnique({
    where: { resetPasswordToken: token },
  });

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

  await database.$transaction(async (tx) => {
    await Promise.all([
      userService.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
        },
      }),
      tokenService.invalidateUserTokens(user.id, tx),
    ]);
  });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.put('/reset-password', validateMiddleware(resetPasswordSchema), validator, handler);
};
