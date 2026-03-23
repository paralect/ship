import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import { emailService } from 'services';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { Template } from 'types';

const emptyOutput = z.object({});

export default pub
  .input(z.object({ email: emailSchema }))
  .output(emptyOutput)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await userService.findOne({ email });

    if (!user) return {};

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    const emailVerificationToken = await tokenService.createToken({
      userId: user._id,
      type: TokenType.EMAIL_VERIFICATION,
      expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
    });

    const emailVerificationUrl = new URL(`${config.API_URL}/account/verify-email`);
    emailVerificationUrl.searchParams.set('token', emailVerificationToken);

    await emailService.sendTemplate<typeof Template.VERIFY_EMAIL>({
      to: user.email,
      subject: 'Please Confirm Your Email Address for Ship',
      template: Template.VERIFY_EMAIL,
      params: {
        firstName: user.firstName,
        href: emailVerificationUrl.toString(),
      },
    });

    return {};
  });
