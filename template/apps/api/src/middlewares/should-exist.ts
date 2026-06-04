import { ORPCError, os } from '@orpc/server';

import type { User } from '@/db';
import type { ORPCContext } from '@/types';

/**
 * Loads an entity into `context[ctxKey]` and throws NOT_FOUND when it is absent.
 * The loader decides what "exists" means (custom where, relationship/link check,
 * relation-loaded query). Use `shouldOwn` for the common load-by-id-owned case.
 */
export default function shouldExist<K extends string, T>(
  ctxKey: K,
  load: (args: {
    input: Record<string, unknown>;
    context: ORPCContext & { user: User };
  }) => Promise<T | null | undefined>,
  notFoundMessage?: string,
) {
  return os.middleware(async ({ context, next }, input: Record<string, unknown>) => {
    const entity = await load({ input, context: context as ORPCContext & { user: User } });

    if (!entity) {
      throw new ORPCError('NOT_FOUND', { message: notFoundMessage ?? `${ctxKey} not found` });
    }

    return next({ context: { ...context, [ctxKey]: entity } as typeof context & Record<K, T> });
  });
}
