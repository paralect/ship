import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { authService, emailService } from 'services';
import { clientUtil } from 'utils';

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
    const clientType = clientUtil.detectClientType(ctx);
    if (clientType === clientUtil.ClientType.MOBILE) {
      ctx.throwClientError({ token: 'Token is invalid or expired' }, 400);
      return;
    }
    ctx.throwGlobalErrorWithRedirect('Token is invalid or expired.');
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  try {
    const { user } = ctx.validatedData;
    const clientType = clientUtil.detectClientType(ctx);

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    const updatedUser = await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    ctx.assertClientError(updatedUser, {
      message: 'Failed to update user',
    });

    const accessToken = await authService.setAccessToken({ ctx, userId: user._id });

    await emailService.sendTemplate<Template.SIGN_UP_WELCOME>({
      to: updatedUser.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
      params: {
        firstName: updatedUser.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    if (clientType === clientUtil.ClientType.MOBILE) {
      ctx.body = {
        accessToken,
        user: userService.getPublic(updatedUser),
      };
      return;
    }

    ctx.redirect(config.WEB_URL);
  } catch (error) {
    const clientType = clientUtil.detectClientType(ctx);
    if (clientType === clientUtil.ClientType.MOBILE) {
      ctx.throwClientError({ message: 'Failed to verify email. Please try again.' }, 500);
      return;
    }
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
  router.post(
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
