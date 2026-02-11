import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { isPublic } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

import { resetPasswordSchema } from '../account.schema';
import { AppKoaContext, ResetPasswordParams, TokenType, User } from 'types';

export const schema = resetPasswordSchema;

interface ValidatedData extends ResetPasswordParams {
  user: User;
}

const validator = createMiddleware(async (ctx, next) => {
  const { token } = ctx.validatedData;

  const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);
  const user = await userService.findOne({ _id: resetPasswordToken?.userId });

  if (!resetPasswordToken || !user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
});

export default createEndpoint({
  method: 'put',
  path: '/reset-password',
  schema,
  middlewares: [isPublic, rateLimitMiddleware(), validator],

  async handler(ctx) {
    const { user, password } = (ctx as AppKoaContext<ValidatedData>).validatedData;

    const passwordHash = await securityUtil.hashPassword(password);

    await tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD);

    await userService.updateOne({ _id: user._id }, () => ({ passwordHash }));

    ctx.status = 204;
  },
});
