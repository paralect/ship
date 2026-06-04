import { ORPCError, os } from '@orpc/server';

import type { ORPCContext } from '@/types';

const base = os.$context<ORPCContext>();

export default base.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  if (!context.user.isAdmin) {
    throw new ORPCError('FORBIDDEN', { message: 'Admin access required' });
  }

  return next({ context: { ...context, user: context.user, isAdmin: true as const } });
});
