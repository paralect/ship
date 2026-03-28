import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { publicSchema } from '@/resources/users/users.schema';
import { emailService } from '@ship/emails';
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

    const user = emailVerificationToken
      ? await db.users.findFirst({ where: { id: emailVerificationToken.userId } })
      : undefined;

    if (!emailVerificationToken || !user) {
      throw new ClientError({ token: 'Token is invalid or expired' });
    }

    await db.tokens.deleteMany({ userId: user.id, type: 'email-verification' });
    await db.users.updateOne({ id: user.id }, { isEmailVerified: true });

    const accessToken = await setAccessToken({ ctx: context, userId: user.id });

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
