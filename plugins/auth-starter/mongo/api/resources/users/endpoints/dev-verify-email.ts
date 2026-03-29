import { z } from 'zod';

import config from '@/config';
import db from '@/db';
import { isPublic } from '@/procedures';

export default isPublic
  .input(z.object({ email: z.string() }))
  .handler(async ({ input }) => {
    if (!config.IS_DEV) {
      throw new Error('This endpoint is only available in development');
    }

    await db.users.atomic.updateOne({ email: input.email }, { $set: { isEmailVerified: true } });
  });
