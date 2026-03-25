import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import config from '@/config';
import { db, tokens, users } from '@/db';
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

      const [user] = emailVerificationToken
        ? await db.select().from(users).where(eq(users.id, emailVerificationToken.userId)).limit(1)
        : [];

      if (!emailVerificationToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      await db.delete(tokens).where(and(eq(tokens.userId, user.id), eq(tokens.type, TokenType.EMAIL_VERIFICATION)));
      await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, user.id));

      await setAccessToken({ ctx: context, userId: user.id });

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
