import { pub } from 'procedures';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import { authService, emailService } from 'services';

import config from 'config';

import { Template } from 'types';

export default pub
  .route({
    method: 'GET',
    path: '/account/verify-email',
    successStatus: 307,
    outputStructure: 'detailed',
  })
  .input(z.object({ token: z.string().optional() }))
  .handler(async ({ input, context }) => {
    try {
      if (!input.token) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is required'));
        return { headers: { location: url.toString() } };
      }

      const emailVerificationToken = await tokenService.validateToken(input.token, TokenType.EMAIL_VERIFICATION);
      const user = await userService.findOne({ _id: emailVerificationToken?.userId });

      if (!emailVerificationToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);
      await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

      await authService.setAccessToken({ ctx: context, userId: user._id });

      await emailService.sendTemplate<typeof Template.SIGN_UP_WELCOME>({
        to: user.email,
        subject: 'Welcome to Ship Community!',
        template: Template.SIGN_UP_WELCOME,
        params: {
          firstName: user.firstName,
          href: `${config.WEB_URL}/sign-in`,
        },
      });

      return { headers: { location: config.WEB_URL } };
    } catch {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Failed to verify email. Please try again.'));
      return { headers: { location: url.toString() } };
    }
  });
