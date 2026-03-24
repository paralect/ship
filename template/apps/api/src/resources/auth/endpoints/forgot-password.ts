import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import createToken from 'resources/tokens/methods/create-token';
import { TokenType } from 'resources/tokens/tokens.schema';

import { emailService } from 'services';

import config from 'config';

import { tokensService, usersService } from 'db';

import { RESET_PASSWORD_TOKEN } from 'app-constants';
import { Template } from 'types';

const emptyOutput = z.object({});

export default pub
  .input(z.object({ email: emailSchema }))
  .output(emptyOutput)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await usersService.findOne({ email });

    if (!user) return {};

    await Promise.all([
      tokensService.deleteMany({ userId: user._id, type: TokenType.ACCESS }),
      tokensService.deleteMany({ userId: user._id, type: TokenType.RESET_PASSWORD }),
    ]);

    const resetPasswordToken = await createToken({
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
