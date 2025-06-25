import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';

import config from 'config';

import { AppKoaContext, AppRouter, TokenType, User } from 'types';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
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
}

export default (router: AppRouter) => {
  router.get('/verify-reset-token', rateLimitMiddleware(), validateMiddleware(schema), handler);
};
