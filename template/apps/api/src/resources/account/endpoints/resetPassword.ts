import { passwordSchema, TokenType } from 'shared';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { securityUtil } from 'utils';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

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
