import { ORPCError, os } from '@orpc/server';

import type { ORPCContext } from '@/types';

const base = os.$context<ORPCContext>();

export default base.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  return next({ context: { ...context, user: context.user } });
});
