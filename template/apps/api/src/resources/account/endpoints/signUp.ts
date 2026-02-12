import { emailSchema, passwordSchema } from 'resources/base.schema';
import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';
import { userSchema } from 'resources/users/user.schema';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { emailService } from 'services';
import { securityUtil } from 'utils';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { Template } from 'types';

const schema = userSchema.pick({ firstName: true, lastName: true }).extend({
  email: emailSchema,
  password: passwordSchema,
});

export default createEndpoint({
  method: 'post',
  path: '/sign-up',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { firstName, lastName, email, password } = ctx.validatedData;

    const isUserExists = await userService.exists({ email });

    if (isUserExists) {
      ctx.throwClientError({
        email: 'User with this email is already registered',
      });
    }

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
