import { pub } from 'procedures';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';
import { userPublicSchema } from 'resources/users/user.schema';

import { authService, emailService } from 'services';

import config from 'config';

import { ClientError, Template } from 'types';

const publicUserOutput = userPublicSchema;

export default pub
  .input(z.object({ token: z.string().min(1, 'Token is required') }))
  .output(
    z.object({
      accessToken: z.string(),
      user: publicUserOutput,
    }),
  )
  .handler(async ({ input, context }) => {
    const { token } = input;

    const emailVerificationToken = await tokenService.validateToken(token, TokenType.EMAIL_VERIFICATION);
    const user = await userService.findOne({ _id: emailVerificationToken?.userId });

    if (!emailVerificationToken || !user) {
      throw new ClientError({ token: 'Token is invalid or expired' });
    }

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);
    await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    const accessToken = await authService.setAccessToken({ ctx: context, userId: user._id });

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
      user: userService.getPublic(user),
    };
  });
