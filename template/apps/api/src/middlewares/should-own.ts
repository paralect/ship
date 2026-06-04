import type { DbService } from '@ship/db';

import shouldExist from '@/middlewares/should-exist';

/**
 * Asserts the current user owns the entity identified by `input[idKey]` (falling back
 * to `input.id`), loading it into `context[ctxKey]`. Defaults: `idKey` = `${ctxKey}Id`,
 * `owner` = 'userId', soft-delete aware. A mismatch yields NOT_FOUND (no existence leak).
 * The `input.id` fallback lets one middleware serve both route-param (`${ctxKey}Id`) and
 * body-`id` endpoints, so no per-idKey duplicate middlewares are needed.
 */
export default function shouldOwn<T extends { $inferSelect: unknown; $inferInsert: unknown }, K extends string>(
  ctxKey: K,
  service: DbService<T>,
  opts: { idKey?: string; owner?: string; message?: string } = {},
) {
  const idKey = opts.idKey ?? `${ctxKey}Id`;
  const owner = opts.owner ?? 'userId';

  return shouldExist<K, T['$inferSelect']>(
    ctxKey,
    ({ input, context }) =>
      // eslint-disable-next-line ts/no-explicit-any
      service.findFirst({ where: { id: input[idKey] ?? input.id, [owner]: context.user.id, deletedAt: null } as any }),
    opts.message ?? `${ctxKey} not found`,
  );
}
