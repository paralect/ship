import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { emailService } from 'services';
import { isPublic } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { resendEmailSchema } from '../account.schema';
import { AppKoaContext, ResendEmailParams, Template, TokenType, User } from 'types';

export const schema = resendEmailSchema;

interface ValidatedData extends ResendEmailParams {
  user: User;
}

const validator = createMiddleware(async (ctx, next) => {
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
});

export default createEndpoint({
  method: 'post',
  path: '/resend-email',
  schema,
  middlewares: [isPublic, rateLimitMiddleware(), validator],

  async handler(ctx) {
    const { user } = (ctx as AppKoaContext<ValidatedData>).validatedData;

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
