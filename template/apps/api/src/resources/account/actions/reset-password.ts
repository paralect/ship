import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import { resetPasswordSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, ResetPasswordParams, TokenType, User } from 'types';

interface ValidatedData extends ResetPasswordParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);
  const user = await userService.findOne({ _id: resetPasswordToken?.userId });

  if (!resetPasswordToken || !user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, password } = ctx.validatedData;

  const passwordHash = await securityUtil.hashPassword(password);

  await tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD);

  await userService.updateOne({ _id: user._id }, () => ({ passwordHash }));

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.put('/reset-password', rateLimitMiddleware(), validateMiddleware(resetPasswordSchema), validator, handler);
};
