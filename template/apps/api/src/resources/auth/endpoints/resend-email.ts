import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';

import config from '@/config';
import { db, tokens, users } from '@/db';
import { isPublic } from '@/procedures';
import { emailSchema } from '@/resources/base.schema';
import createToken from '@/resources/tokens/methods/create-token';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { emailService } from '@/services';
import { Template } from '@/types';

export default isPublic
  .input(z.object({ email: emailSchema }))
  .output(z.object({}))
  .handler(async ({ input }) => {
    const { email } = input;
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) return {};

    await db.delete(tokens).where(and(eq(tokens.userId, user.id), eq(tokens.type, TokenType.EMAIL_VERIFICATION)));

    const emailVerificationToken = await createToken({
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
      expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
    });

    const emailVerificationUrl = new URL(`${config.API_URL}/account/verify-email`);
    emailVerificationUrl.searchParams.set('token', emailVerificationToken);

    await emailService.sendTemplate<typeof Template.VERIFY_EMAIL>({
      to: user.email,
      subject: 'Please Confirm Your Email Address for Ship',
      template: Template.VERIFY_EMAIL,
      params: {
        firstName: user.firstName,
        href: emailVerificationUrl.toString(),
      },
    });

    return {};
  });
