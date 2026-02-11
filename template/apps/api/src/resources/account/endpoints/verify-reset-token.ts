import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import config from 'config';

import { TokenType } from 'types';

export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export default createEndpoint({
  method: 'get',
  path: '/verify-reset-token',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    try {
      const { token } = ctx.validatedData;

      const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);

      const user = await userService.findOne({ _id: resetPasswordToken?.userId });

      if (!resetPasswordToken || !user) {
        ctx.throwGlobalErrorWithRedirect('Token is invalid or expired.');
        return;
      }

      const redirectUrl = new URL(`${config.WEB_URL}/reset-password`);

      redirectUrl.searchParams.set('token', token);

      ctx.redirect(redirectUrl.toString());
    } catch (error) {
      ctx.throwGlobalErrorWithRedirect('Failed to verify reset password token. Please try again.');
    }
  },
});
