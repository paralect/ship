import { z } from 'zod';

import db from '@/db';
import { isPublic } from '@/procedures';
import { cookieUtil } from '@/utils';

export default isPublic.output(z.object({})).handler(async ({ context }) => {
  if (context.user) {
    await db.tokens.deleteMany({ userId: context.user.id, type: 'access' });
  }

  await cookieUtil.unsetTokens({ ctx: context });

  return {};
});
