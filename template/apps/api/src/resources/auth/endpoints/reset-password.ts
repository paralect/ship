import { z } from 'zod';

import db from '@/db';
import { isPublic } from '@/procedures';
import validateToken from '@/resources/tokens/methods/validate-token';
import { passwordSchema } from '@/resources/users/drizzle.schema';
import { securityUtil } from '@/utils';

export default isPublic
  .input(
    z.object({
      token: z.string().min(1, 'Token is required'),
      password: passwordSchema,
    }),
  )
  .output(z.object({}))
  .handler(async ({ input }) => {
    const { token, password } = input;

    const resetPasswordToken = await validateToken({ token, type: 'reset-password' });

    const user = resetPasswordToken
      ? await db.users.findFirst({ where: { id: resetPasswordToken.userId } })
      : undefined;

    if (!resetPasswordToken || !user) {
      return {};
    }

    const passwordHash = await securityUtil.hashPassword(password);

    await db.tokens.deleteMany({ userId: user.id, type: 'reset-password' });
    await db.users.updateOne({ id: user.id }, { passwordHash });

    return {};
  });
