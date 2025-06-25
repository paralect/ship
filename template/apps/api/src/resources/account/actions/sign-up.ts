import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { signUpSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, SignUpParams, Template, TokenType } from 'types';

async function validator(ctx: AppKoaContext<SignUpParams>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<SignUpParams>) {
  const { firstName, lastName, email, password } = ctx.validatedData;

  const user = await userService.insertOne({
    email,
    firstName,
    lastName,
    passwordHash: await securityUtil.hashPassword(password),
    isEmailVerified: false,
  });

  const emailVerificationToken = await tokenService.createToken({
    userId: user._id,
    type: TokenType.EMAIL_VERIFICATION,
    expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
  });

  await emailService.sendTemplate<Template.VERIFY_EMAIL>({
    to: user.email,
    subject: 'Please Confirm Your Email Address for Ship',
    template: Template.VERIFY_EMAIL,
    params: {
      firstName: user.firstName,
      href: `${config.API_URL}/account/verify-email?token=${emailVerificationToken}`,
    },
  });

  if (config.IS_DEV) {
    ctx.body = { emailVerificationToken };
    return;
  }

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.post('/sign-up', rateLimitMiddleware(), validateMiddleware(signUpSchema), validator, handler);
};
