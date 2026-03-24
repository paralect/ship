import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { TokenType } from 'resources/token/token.schema';
import createToken from 'resources/token/methods/createToken';
import invalidateUserTokens from 'resources/token/methods/invalidateUserTokens';
import userService from 'resources/users/user.service';

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

    await invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    const emailVerificationToken = await createToken({
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
