import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import validateToken from '@/resources/tokens/methods/validate-token';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { publicSchema } from '@/resources/users/users.schema';
import { emailService } from '@/services';
import { ClientError, Template } from '@/types';

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

    const emailVerificationToken = await validateToken({ token, type: TokenType.EMAIL_VERIFICATION });

    const user = emailVerificationToken
      ? await db.users.findFirst({ where: { id: emailVerificationToken.userId } })
      : undefined;

    if (!emailVerificationToken || !user) {
      throw new ClientError({ token: 'Token is invalid or expired' });
    }

    await db.tokens.deleteMany({ userId: user.id, type: TokenType.EMAIL_VERIFICATION });
    await db.users.updateOne({ id: user.id }, { isEmailVerified: true });

    const accessToken = await setAccessToken({ ctx: context, userId: user.id });

    await emailService.sendTemplate<typeof Template.SIGN_UP_WELCOME>({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
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
