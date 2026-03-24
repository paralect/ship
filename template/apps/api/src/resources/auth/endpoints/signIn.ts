import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import setAccessToken from 'resources/tokens/methods/setAccessToken';
import { TokenType } from 'resources/tokens/tokens.schema';
import { publicSchema } from 'resources/users/users.schema';

import { clientUtil, securityUtil } from 'utils';

import { tokensService, usersService } from 'db';

import { ClientError } from 'types';

export default pub
  .input(
    z.object({
      email: emailSchema,
      password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters.'),
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

    const user = await usersService.findOne({ email }, { isIncludeSecureFields: true });

    if (!user || !user.passwordHash) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    if (!user.isEmailVerified) {
      const token = await tokensService.findOne({ userId: user._id, type: TokenType.EMAIL_VERIFICATION });

      if (!token || token.expiresOn.getTime() <= Date.now()) {
        if (token) await tokensService.deleteOne({ _id: token._id });
        throw new ClientError({ emailVerificationTokenExpired: 'true' });
      }
    }

    if (!user.isEmailVerified) {
      throw new ClientError({ email: 'Please verify your email to sign in' });
    }

    const accessToken = await setAccessToken({ ctx: context, userId: user._id });
    const clientType = clientUtil.detectClientType(context);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        accessToken,
        user,
      };
    }

    return user;
  });
