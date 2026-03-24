import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';
import { userPublicSchema } from 'resources/users/user.schema';

import { authService } from 'services';
import { clientUtil, securityUtil } from 'utils';

import { ClientError } from 'types';

const publicUserOutput = userPublicSchema;

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

    const user = await userService.findOne({ email });

    if (!user || !user.passwordHash) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      throw new ClientError({ credentials: 'The email or password you have entered is invalid' });
    }

    if (!user.isEmailVerified) {
      const existingEmailVerificationToken = await tokenService.getUserActiveToken(
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
        user: userService.getPublic(user),
      };
    }

    return userService.getPublic(user);
  });
