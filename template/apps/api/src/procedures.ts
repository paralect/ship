import { ORPCError, os } from '@orpc/server';

import type { User } from './resources/users/users.schema';
import config from './config';
import type { ORPCContext } from './types';

export const isPublic = os.$context<ORPCContext>();

const authMiddleware = isPublic.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  return next({ context: { ...context, user: context.user as User } });
});

export const isAuthorized = isPublic.use(authMiddleware);

const adminMiddleware = isPublic.middleware(async ({ context, next }) => {
  const adminKey = context.headers['x-admin-key'];

  if (!config.ADMIN_KEY || config.ADMIN_KEY !== adminKey) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Admin access required' });
  }

  return next({ context: { ...context, isAdmin: true as const } });
});

export const isAdmin = isPublic.use(adminMiddleware);

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
