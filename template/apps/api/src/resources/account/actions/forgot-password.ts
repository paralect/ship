import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { emailService } from 'services';

import config from 'config';

import { RESET_PASSWORD_TOKEN } from 'app-constants';
import { forgotPasswordSchema } from 'schemas';
import { AppKoaContext, AppRouter, ForgotPasswordParams, Next, Template, TokenType, User } from 'types';

interface ValidatedData extends ForgotPasswordParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await Promise.all([
    tokenService.invalidateUserTokens(user._id, TokenType.ACCESS),
    tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD),
  ]);

  const resetPasswordToken = await tokenService.createToken({
    userId: user._id,
    type: TokenType.RESET_PASSWORD,
    expiresIn: RESET_PASSWORD_TOKEN.EXPIRATION_SECONDS,
  });

  const resetPasswordUrl = new URL(`${config.API_URL}/account/verify-reset-token`);

  resetPasswordUrl.searchParams.set('token', resetPasswordToken);

  await emailService.sendTemplate<Template.RESET_PASSWORD>({
    to: user.email,
    subject: 'Password Reset Request for Ship',
    template: Template.RESET_PASSWORD,
    params: {
      firstName: user.firstName,
      href: resetPasswordUrl.toString(),
    },
  });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.post(
    '/forgot-password',
    rateLimitMiddleware({
      limitDuration: 60 * 60, // 1 hour
      requestsPerDuration: 10,
    }),
    validateMiddleware(forgotPasswordSchema),
    validator,
    handler,
  );
};
