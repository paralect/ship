import { pub } from 'procedures';
import { z } from 'zod';

import { emailSchema, passwordSchema } from 'resources/base.schema';
import { TokenType } from 'resources/token/token.schema';
import createToken from 'resources/token/methods/createToken';
import userService from 'resources/users/user.service';
import { userPublicSchema, userSchema } from 'resources/users/user.schema';

import { emailService } from 'services';
import { clientUtil, securityUtil } from 'utils';

import config from 'config';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';
import { ClientError, Template } from 'types';

const publicUserOutput = userPublicSchema;

export default pub
  .input(
    userSchema.pick({ firstName: true, lastName: true }).extend({
      email: emailSchema,
      password: passwordSchema,
    }),
  )
  .output(
    z.object({
      emailVerificationToken: z.string().optional(),
      user: publicUserOutput.optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { firstName, lastName, email, password } = input;

    const isUserExists = await userService.exists({ email });

    if (isUserExists) {
      throw new ClientError({ email: 'User with this email is already registered' });
    }

    const user = await userService.insertOne({
      email,
      firstName,
      lastName,
      passwordHash: await securityUtil.hashPassword(password),
      isEmailVerified: false,
    });

    const emailVerificationToken = await createToken({
      userId: user._id,
      type: TokenType.EMAIL_VERIFICATION,
      expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
    });

    await emailService.sendTemplate<typeof Template.VERIFY_EMAIL>({
      to: user.email,
      subject: 'Please Confirm Your Email Address for Ship',
      template: Template.VERIFY_EMAIL,
      params: {
        firstName: user.firstName,
        href: `${config.API_URL}/account/verify-email?token=${emailVerificationToken}`,
      },
    });

    const clientType = clientUtil.detectClientType(context);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        emailVerificationToken: config.IS_DEV ? emailVerificationToken : undefined,
        user: userService.getPublic(user),
      };
    }

    if (config.IS_DEV) {
      return { emailVerificationToken };
    }

    return {};
  });
