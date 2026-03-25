import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db, tokens, users } from '@/db';
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

    const [user] = resetPasswordToken
      ? await db.select().from(users).where(eq(users.id, resetPasswordToken.userId)).limit(1)
      : [];

    if (!resetPasswordToken || !user) return {};

    const passwordHash = await securityUtil.hashPassword(password);

    await db.delete(tokens).where(and(eq(tokens.userId, user.id), eq(tokens.type, TokenType.RESET_PASSWORD)));
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

    return {};
  });
