import { z } from 'zod';

import db from '@/db';
import { isPublic } from '@/procedures';
import { passwordSchema } from '@/resources/base.schema';
import validateToken from '@/resources/tokens/methods/validate-token';
import { TokenType } from '@/resources/tokens/tokens.schema';
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

    const resetPasswordToken = await validateToken({ token, type: TokenType.RESET_PASSWORD });
    const user = await db.users.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) return {};

    const passwordHash = await securityUtil.hashPassword(password);

    await db.tokens.deleteMany({ userId: user._id, type: TokenType.RESET_PASSWORD });
    await db.users.updateOne({ _id: user._id }, () => ({ passwordHash }));

    return {};
  });
