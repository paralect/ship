import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { emailService } from '@ship/emails';

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

      const user = emailVerificationToken
        ? await db.users.findFirst({ where: { id: emailVerificationToken.userId } })
        : undefined;

      if (!emailVerificationToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      await db.tokens.deleteMany({ userId: user.id, type: 'email-verification' });
      await db.users.updateOne({ id: user.id }, { isEmailVerified: true });

      await setAccessToken({ ctx: context, userId: user.id });

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
