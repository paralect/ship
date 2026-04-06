import { emailSchema, passwordSchema, TokenType, userSchema } from 'shared';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { emailService } from 'services';
import { clientUtil, securityUtil } from 'utils';
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

    const clientType = clientUtil.detectClientType(ctx);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        emailVerificationToken: config.IS_DEV ? emailVerificationToken : undefined,
        user: userService.getPublic(user),
      };
    }

    if (config.IS_DEV) {
      return { emailVerificationToken };
    }

    ctx.status = 204;
  },
});
