import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import { emailSchema } from '@/resources/base.schema';
import createToken from '@/resources/tokens/methods/create-token';
import { emailService } from '@/services';

export default isPublic
  .input(z.object({ email: emailSchema }))
  .output(z.object({}))
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await db.users.findOne({ email });

    if (!user) return {};

    await Promise.all([
      db.tokens.deleteMany({ userId: user._id, type: 'access' }),
      db.tokens.deleteMany({ userId: user._id, type: 'reset-password' }),
    ]);

    const resetPasswordToken = await createToken({
      userId: user._id,
      type: 'reset-password',
    });

    const resetPasswordUrl = new URL(`${config.API_URL}/account/verify-reset-token`);
    resetPasswordUrl.searchParams.set('token', resetPasswordToken);

    await emailService.sendTemplate({
      to: user.email,
      subject: 'Password Reset Request for Ship',
      template: 'reset-password',
      params: {
        firstName: user.firstName,
        href: resetPasswordUrl.toString(),
      },
    });

    return {};
  });
