import { ORPCError, os } from '@orpc/server';

import type { User } from './resources/users/user.schema';
import type { ORPCContext } from './types';

export const pub = os.$context<ORPCContext>();

const authMiddleware = pub.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  return next({ context: { ...context, user: context.user as User } });
});

export const authed = pub.use(authMiddleware);

export function withEntity<T>(load: (id: string) => Promise<T | null>, name: string) {
  const key = name.toLowerCase();

  return os.middleware(async ({ context, next }, input: { id: string }) => {
    const entity = await load(input.id);

    if (!entity) {
      throw new ORPCError('NOT_FOUND', { message: `${name} not found` });
    }

    return next({ context: { ...context, [key]: entity } });
  });
}

export { ORPCError };
