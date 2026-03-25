import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db, tokens } from '@/db';
import { isPublic } from '@/procedures';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { cookieUtil } from '@/utils';

export default isPublic.output(z.object({})).handler(async ({ context }) => {
  if (context.user) {
    await db.delete(tokens).where(and(eq(tokens.userId, context.user.id), eq(tokens.type, TokenType.ACCESS)));
  }

  await cookieUtil.unsetTokens({ ctx: context });

  return {};
});
