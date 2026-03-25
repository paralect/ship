import { z } from 'zod';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import createToken from '@/resources/tokens/methods/create-token';
import { emailSchema } from '@/resources/users/users.schema';
import { emailService } from '@/services';
import { Template } from '@/types';

export default isPublic
  .input(z.object({ email: emailSchema }))
  .output(z.object({}))
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await db.users.findFirst({ where: { email } });

    if (!user) {
      return {};
    }

    await db.tokens.deleteMany({ userId: user.id, type: 'email-verification' });

    const emailVerificationToken = await createToken({
      userId: user.id,
      type: 'email-verification',
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
