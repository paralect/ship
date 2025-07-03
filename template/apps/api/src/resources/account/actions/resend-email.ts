import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { emailService } from 'services';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { resendEmailSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, ResendEmailParams, Template, TokenType, User } from 'types';

interface ValidatedData extends ResendEmailParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) {
    ctx.status = 204;
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

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
}

export default (router: AppRouter) => {
  router.post('/resend-email', rateLimitMiddleware(), validateMiddleware(resendEmailSchema), validator, handler);
};
