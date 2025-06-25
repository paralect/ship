import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { authService, emailService } from 'services';

import config from 'config';

import { AppKoaContext, AppRouter, Next, Template, TokenType, User } from 'types';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const emailVerificationToken = await tokenService.validateToken(token, TokenType.EMAIL_VERIFICATION);
  const user = await userService.findOne({ _id: emailVerificationToken?.userId });

  if (!emailVerificationToken || !user) {
    ctx.throwGlobalErrorWithRedirect('Token is invalid or expired.');
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  try {
    const { user } = ctx.validatedData;

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    await authService.setAccessToken({ ctx, userId: user._id });

    await emailService.sendTemplate<Template.SIGN_UP_WELCOME>({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
      params: {
        firstName: user.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    ctx.redirect(config.WEB_URL);
  } catch (error) {
    ctx.throwGlobalErrorWithRedirect('Failed to verify email. Please try again.');
  }
}

export default (router: AppRouter) => {
  router.get(
    '/verify-email',
    rateLimitMiddleware({
      limitDuration: 60 * 60, // 1 hour
      requestsPerDuration: 10,
    }),
    validateMiddleware(schema),
    validator,
    handler,
  );
};
