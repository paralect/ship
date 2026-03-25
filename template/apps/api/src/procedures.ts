import { ORPCError, os } from '@orpc/server';

import type { ORPCContext } from './types';

import type { User } from '@/db';

export const isPublic = os.$context<ORPCContext>();
const isAuthorizedContext = os.$context<ORPCContext & { user: User }>();

const authMiddleware = isPublic.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  return next({ context: { ...context, user: context.user as User } });
});

export const isAuthorized = isPublic.use(authMiddleware);

const adminMiddleware = isAuthorizedContext.middleware(async ({ context, next }) => {
  if (!context.user.isAdmin) {
    throw new ORPCError('FORBIDDEN', { message: 'Admin access required' });
  }

  return next({ context: { ...context, isAdmin: true as const } });
});

export const isAdmin = isAuthorized.use(adminMiddleware);

export function shouldExist<T>(load: (id: string) => Promise<T | null>, name: string) {
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
