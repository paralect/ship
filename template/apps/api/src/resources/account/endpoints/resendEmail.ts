import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema } from 'resources/base.schema';
import { TokenType } from 'resources/tokens/tokens.schema';
import createToken from 'resources/tokens/methods/createToken';

import { usersService, tokensService } from 'db';

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
    const user = await usersService.findOne({ email });

    if (!user) return {};

    await tokensService.deleteMany({ userId: user._id, type: TokenType.EMAIL_VERIFICATION });

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
