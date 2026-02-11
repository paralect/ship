import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';
import { isPublic } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { signUpSchema } from '../account.schema';
import { AppKoaContext, SignUpParams, Template, TokenType } from 'types';

export const schema = signUpSchema;

const validator = createMiddleware(async (ctx, next) => {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
});

export default createEndpoint({
  method: 'post',
  path: '/sign-up',
  schema,
  middlewares: [isPublic, rateLimitMiddleware(), validator],

  async handler(ctx) {
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
      return { emailVerificationToken };
    }

    ctx.status = 204;
  },
});
