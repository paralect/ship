import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { authService, emailService } from 'services';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import config from 'config';

import { Template, TokenType } from 'types';

export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export default createEndpoint({
  method: 'get',
  path: '/verify-email',
  schema,
  middlewares: [
    isPublic,
    rateLimitMiddleware({
      limitDuration: 60 * 60, // 1 hour
      requestsPerDuration: 10,
    }),
  ],

  async handler(ctx) {
    try {
      const { token } = ctx.validatedData;

      const emailVerificationToken = await tokenService.validateToken(token, TokenType.EMAIL_VERIFICATION);
      const user = await userService.findOne({ _id: emailVerificationToken?.userId });

      if (!emailVerificationToken || !user) {
        ctx.throwGlobalErrorWithRedirect('Token is invalid or expired.');
        return;
      }

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
  },
});
