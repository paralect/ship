import { TokenType } from 'shared';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { authService, emailService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

import { Template } from 'types';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export default createEndpoint({
  method: 'post',
  path: '/verify-email/token',
  schema,
  middlewares: [
    isPublic,
    rateLimitMiddleware({
      limitDuration: 60 * 60,
      requestsPerDuration: 10,
    }),
  ],

  async handler(ctx) {
    const { token } = ctx.validatedData;

    const emailVerificationToken = await tokenService.validateToken(token, TokenType.EMAIL_VERIFICATION);
    const user = await userService.findOne({ _id: emailVerificationToken?.userId });

    if (!emailVerificationToken || !user) {
      return ctx.throwClientError({ token: 'Token is invalid or expired' }, 400);
    }

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    const accessToken = await authService.setAccessToken({ ctx, userId: user._id });

    await emailService.sendTemplate<Template.SIGN_UP_WELCOME>({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
      params: {
        firstName: user.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    return {
      accessToken,
      user: userService.getPublic(user),
    };
  },
});
