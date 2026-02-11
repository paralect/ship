import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import { resetPasswordSchema } from '../account.schema';
import { TokenType } from 'types';

export const schema = resetPasswordSchema;

export default createEndpoint({
  method: 'put',
  path: '/reset-password',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { token, password } = ctx.validatedData;

    const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);
    const user = await userService.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) {
      ctx.status = 204;
      return;
    }

    const passwordHash = await securityUtil.hashPassword(password);

    await tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD);

    await userService.updateOne({ _id: user._id }, () => ({ passwordHash }));

    ctx.status = 204;
  },
});
