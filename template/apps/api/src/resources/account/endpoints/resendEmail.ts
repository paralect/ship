import { emailSchema, TokenType } from 'shared';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { emailService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { Template } from 'types';

const schema = z.object({
  email: emailSchema,
});

export default createEndpoint({
  method: 'post',
  path: '/resend-email',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { email } = ctx.validatedData;

    const user = await userService.findOne({ email });

    if (!user) {
      ctx.status = 204;
      return;
    }

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);

    const emailVerificationToken = await tokenService.createToken({
      userId: user._id,
      type: TokenType.EMAIL_VERIFICATION,
      expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
    });

    const emailVerificationUrl = new URL(`${config.API_URL}/account/verify-email`);

    emailVerificationUrl.searchParams.set('token', emailVerificationToken);

    await emailService.sendTemplate<Template.VERIFY_EMAIL>({
      to: user.email,
      subject: 'Please Confirm Your Email Address for Ship',
      template: Template.VERIFY_EMAIL,
      params: {
        firstName: user.firstName,
        href: emailVerificationUrl.toString(),
      },
    });

    ctx.status = 204;
  },
});
