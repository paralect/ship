import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { TokenType } from 'resources/tokens/tokens.schema';
import getUserActiveToken from 'resources/tokens/methods/getUserActiveToken';
import { publicSchema } from 'resources/users/users.schema';
import getPublic from 'resources/users/methods/getPublic';
import { usersService } from 'db';

import { authService } from 'services';
import { clientUtil, securityUtil } from 'utils';

import { ClientError } from 'types';


const publicUserOutput = publicSchema;

export default pub
  .input(
    z.object({
      email: emailSchema,
      password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters.'),
    }),
  )
  .output(
    z.union([
      publicUserOutput,
      z.object({
        accessToken: z.string(),
        user: publicUserOutput,
      }),
    ]),
  )
  .handler(async ({ input, context }) => {
    const { email, password } = input;

    const user = await usersService.findOne({ email });

    if (!user || !user.passwordHash) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    if (!user.isEmailVerified) {
      const existingEmailVerificationToken = await getUserActiveToken(
        user._id,
        TokenType.EMAIL_VERIFICATION,
      );

      if (!existingEmailVerificationToken) {
        throw new ClientError({ emailVerificationTokenExpired: 'true' });
      }
    }

    if (!user.isEmailVerified) {
      throw new ClientError({ email: 'Please verify your email to sign in' });
    }

    const accessToken = await authService.setAccessToken({ ctx: context, userId: user._id });
    const clientType = clientUtil.detectClientType(context);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        accessToken,
        user: getPublic(user),
      };
    }

    return getPublic(user);
  });
