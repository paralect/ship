import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { publicSchema } from '@/resources/users/users.schema';
import { emailService } from '@/services';
import { ClientError } from '@/types';

export default isPublic
  .input(z.object({ token: z.string().min(1, 'Token is required') }))
  .output(
    z.object({
      accessToken: z.string(),
      user: publicSchema,
    }),
  )
  .handler(async ({ input, context }) => {
    const { token } = input;

    const emailVerificationToken = await validateToken({ token, type: 'email-verification' });
    const user = await db.users.findOne({ _id: emailVerificationToken?.userId });

    if (!emailVerificationToken || !user) {
      throw new ClientError({ token: 'Token is invalid or expired' });
    }

    await db.tokens.deleteMany({ userId: user._id, type: 'email-verification' });
    await db.users.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    const accessToken = await setAccessToken({ ctx: context, userId: user._id });

    await emailService.sendTemplate({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: 'sign-up-welcome',
      params: {
        firstName: user.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    return {
      accessToken,
      user,
    };
  });
