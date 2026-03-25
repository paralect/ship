import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { emailService } from '@/services';

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

      const emailVerificationToken = await validateToken({ token: input.token, type: 'email-verification' });
      const user = await db.users.findOne({ _id: emailVerificationToken?.userId });

      if (!emailVerificationToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      await db.tokens.deleteMany({ userId: user._id, type: 'email-verification' });
      await db.users.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

      await setAccessToken({ ctx: context, userId: user._id });

      await emailService.sendTemplate({
        to: user.email,
        subject: 'Welcome to Ship Community!',
        template: 'sign-up-welcome',
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
