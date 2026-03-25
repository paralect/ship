import { z } from 'zod';

import db from '@/db';
import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import { emailSchema, passwordSchema, publicSchema } from '@/resources/users/drizzle.schema';
import { ClientError } from '@/types';
import { clientUtil, securityUtil } from '@/utils';

export default isPublic
  .input(
    z.object({
      email: emailSchema,
      password: passwordSchema,
    }),
  )
  .output(
    z.union([
      publicSchema,
      z.object({
        accessToken: z.string(),
        user: publicSchema,
      }),
    ]),
  )
  .handler(async ({ input, context }) => {
    const { email, password } = input;

    const user = await db.users.findFirst({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    if (!user.isEmailVerified) {
      const token = await db.tokens.findFirst({
        where: { userId: user.id, type: 'email-verification' },
      });

      if (!token || token.expiresOn.getTime() <= Date.now()) {
        if (token) {
          await db.tokens.deleteOne({ id: token.id });
        }
        throw new ClientError({ emailVerificationTokenExpired: 'true' });
      }
    }

    if (!user.isEmailVerified) {
      throw new ClientError({ email: 'Please verify your email to sign in' });
    }

    const accessToken = await setAccessToken({ ctx: context, userId: user.id });
    const clientType = clientUtil.detectClientType(context);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        accessToken,
        user,
      };
    }

    return user;
  });
