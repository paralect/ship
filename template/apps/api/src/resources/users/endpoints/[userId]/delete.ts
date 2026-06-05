import { ORPCError } from '@orpc/server';
import { z } from 'zod';

import db from '@/db';
import endpoint from '@/endpoint';
import isAdmin from '@/middlewares/is-admin';

export default endpoint
  .use(isAdmin)
  .input(z.object({ userId: z.string().min(1) }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    const user = await db.users.findFirst({ where: { id: input.userId, deletedAt: null } });
    if (!user) {
      throw new ORPCError('NOT_FOUND', { message: 'User not found' });
    }

    await db.users.updateOne({ id: input.userId }, { deletedAt: new Date() });

    // Invalidate any pending invite tokens issued to this user's email.
    const pendingTokens = await db.inviteTokens.find({ where: { email: user.email, usedAt: null } });
    for (const t of pendingTokens) {
      await db.inviteTokens.updateOne({ id: t.id }, { usedAt: new Date() });
    }

    return { success: true };
  });
