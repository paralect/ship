import { ORPCError, os } from '@orpc/server';

import type { ORPCContext } from './types';

import appLogger, { loggerStorage } from '@/logger';

const base = os.$context<ORPCContext>();

const loggerMiddleware = base.middleware(async ({ context, path, next }) => {
  const endpoint = path.at(-1) ?? 'unknown';
  const child = appLogger.child({ endpoint });
  return loggerStorage.run(child, () => next({ context }));
});

export const isPublic = base.use(loggerMiddleware);

const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED', { message: 'Authentication required' });
  }

  return next({ context: { ...context, user: context.user } });
});

export const isAuthorized = isPublic.use(authMiddleware);

const adminMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.user?.isAdmin) {
    throw new ORPCError('FORBIDDEN', { message: 'Admin access required' });
  }

  return next({ context: { ...context, user: context.user, isAdmin: true as const } });
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
