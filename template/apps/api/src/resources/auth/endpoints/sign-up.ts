import { z } from 'zod';

import { EMAIL_VERIFICATION_TOKEN } from 'app-constants';

import config from '@/config';
import db from '@/db';
import { eventBus } from '@/event-bus';
import { isPublic } from '@/procedures';
import createToken from '@/resources/tokens/methods/create-token';
import usersSchema, { emailSchema, passwordSchema, publicSchema } from '@/resources/users/users.schema';
import { emailService } from '@/services';
import { ClientError, Template } from '@/types';
import { clientUtil, securityUtil } from '@/utils';

export default isPublic
  .input(
    usersSchema.pick({ firstName: true, lastName: true }).extend({
      email: emailSchema,
      password: passwordSchema,
    }),
  )
  .output(
    z.object({
      emailVerificationToken: z.string().optional(),
      user: publicSchema.optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { firstName, lastName, email, password } = input;

    const existingUser = await db.users.findFirst({ where: { email } });

    if (existingUser) {
      throw new ClientError({ email: 'User with this email is already registered' });
    }

    const user = await db.users.insertOne({
      email,
      firstName,
      lastName,
      passwordHash: await securityUtil.hashPassword(password),
      isEmailVerified: false,
    });

    eventBus.emit('users.created', { doc: user });

    const emailVerificationToken = await createToken({
      userId: user.id,
      type: 'email-verification',
      expiresIn: EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
    });

    await emailService.sendTemplate({
      to: email,
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
        user,
      };
    }

    if (config.IS_DEV) {
      return { emailVerificationToken };
    }

    return {};
  });
