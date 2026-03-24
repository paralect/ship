import { z } from 'zod';

import config from '@/config';
import { tokensService, usersService } from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { emailService } from '@/services';
import { Template } from '@/types';

export default isPublic
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

      const emailVerificationToken = await validateToken({ token: input.token, type: TokenType.EMAIL_VERIFICATION });
      const user = await usersService.findOne({ _id: emailVerificationToken?.userId });

      if (!emailVerificationToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      await tokensService.deleteMany({ userId: user._id, type: TokenType.EMAIL_VERIFICATION });
      await usersService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

      await setAccessToken({ ctx: context, userId: user._id });

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
