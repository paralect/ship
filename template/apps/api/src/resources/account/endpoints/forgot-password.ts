import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { emailService } from 'services';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import config from 'config';

import { RESET_PASSWORD_TOKEN } from 'app-constants';
import { forgotPasswordSchema } from '../account.schema';
import { Template, TokenType } from 'types';

export const schema = forgotPasswordSchema;

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
