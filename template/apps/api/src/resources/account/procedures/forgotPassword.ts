import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import { emailService } from 'services';

import config from 'config';

import { RESET_PASSWORD_TOKEN } from 'app-constants';
import { Template } from 'types';

const emptyOutput = z.object({});

export default pub
  .input(z.object({ email: emailSchema }))
  .output(emptyOutput)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await userService.findOne({ email });

    if (!user) return {};

    await Promise.all([
      tokenService.invalidateUserTokens(user._id, TokenType.ACCESS),
      tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD),
    ]);

    const resetPasswordToken = await tokenService.createToken({
      userId: user._id,
      type: TokenType.RESET_PASSWORD,
      expiresIn: RESET_PASSWORD_TOKEN.EXPIRATION_SECONDS,
    });

    const resetPasswordUrl = new URL(`${config.API_URL}/account/verify-reset-token`);
    resetPasswordUrl.searchParams.set('token', resetPasswordToken);

    await emailService.sendTemplate<typeof Template.RESET_PASSWORD>({
      to: user.email,
      subject: 'Password Reset Request for Ship',
      template: Template.RESET_PASSWORD,
      params: {
        firstName: user.firstName,
        href: resetPasswordUrl.toString(),
      },
    });

    return {};
  });
