import { emailSchema, TokenType } from 'shared';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { emailService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

import { RESET_PASSWORD_TOKEN } from 'app-constants';
import { Template } from 'types';

const schema = z.object({
  email: emailSchema,
});

export default createEndpoint({
  method: 'post',
  path: '/forgot-password',
  schema,
  middlewares: [
    isPublic,
    rateLimitMiddleware({
      limitDuration: 60 * 60, // 1 hour
      requestsPerDuration: 10,
    }),
  ],

  async handler(ctx) {
    const { email } = ctx.validatedData;

    const user = await userService.findOne({ email });

    if (!user) {
      ctx.status = 204;
      return;
    }

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

    await emailService.sendTemplate<Template.RESET_PASSWORD>({
      to: user.email,
      subject: 'Password Reset Request for Ship',
      template: Template.RESET_PASSWORD,
      params: {
        firstName: user.firstName,
        href: resetPasswordUrl.toString(),
      },
    });

    ctx.status = 204;
  },
});
