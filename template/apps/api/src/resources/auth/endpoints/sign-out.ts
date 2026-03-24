import { z } from 'zod';

import { tokensService } from '@/db';
import { pub } from '@/procedures';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { cookieUtil } from '@/utils';

export default pub.output(z.object({})).handler(async ({ context }) => {
  if (context.user) {
    await tokensService.deleteMany({ userId: context.user._id, type: TokenType.ACCESS });
  }

  await cookieUtil.unsetTokens({ ctx: context });

  return {};
});
