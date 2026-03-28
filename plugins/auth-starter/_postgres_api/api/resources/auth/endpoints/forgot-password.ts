import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';
import createToken from '@/resources/tokens/methods/create-token';
import { emailSchema } from '@/resources/users/users.schema';
import { emailService } from '@ship/emails';

export default isPublic
  .input(z.object({ email: emailSchema }))
  .output(z.object({}))
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await db.users.findFirst({ where: { email } });

    if (!user) {
      return {};
    }

    await Promise.all([
      db.tokens.deleteMany({ userId: user.id, type: 'access' }),
      db.tokens.deleteMany({ userId: user.id, type: 'reset-password' }),
    ]);

    const resetPasswordToken = await createToken({
      userId: user.id,
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
