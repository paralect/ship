import { z } from 'zod';

import db from '@/db';
import { isPublic } from '@/procedures';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { cookieUtil } from '@/utils';

export default isPublic.output(z.object({})).handler(async ({ context }) => {
  if (context.user) {
    await db.tokens.deleteMany({ userId: context.user._id, type: TokenType.ACCESS });
  }

  await cookieUtil.unsetTokens({ ctx: context });

  return {};
});
