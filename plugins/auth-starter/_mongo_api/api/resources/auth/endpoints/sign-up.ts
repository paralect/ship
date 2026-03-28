import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import { emailSchema, passwordSchema } from '@/resources/base.schema';
import createToken from '@/resources/tokens/methods/create-token';
import usersSchema, { publicSchema } from '@/resources/users/users.schema';
import { emailService } from '@ship/emails';
import { ClientError } from '@/types';
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

    const isUserExists = await db.users.exists({ email });

    if (isUserExists) {
      throw new ClientError({ email: 'User with this email is already registered' });
    }

    const user = await db.users.insertOne({
      email,
      firstName,
      lastName,
      passwordHash: await securityUtil.hashPassword(password),
      isEmailVerified: false,
    });

    const emailVerificationToken = await createToken({
      userId: user._id,
      type: 'email-verification',
    });

    await emailService.sendTemplate({
      to: user.email,
      subject: 'Please Confirm Your Email Address for Ship',
      template: 'verify-email',
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
