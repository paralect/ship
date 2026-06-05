import type { DbService } from '@ship/db';

import canAccess from '@/middlewares/can-access';

export default function canEdit<T extends { $inferSelect: unknown; $inferInsert: unknown }, K extends string>(
  ctxKey: K,
  service: DbService<T>,
  opts: { idKey?: string; owner?: string; message?: string } = {},
) {
  const idKey = opts.idKey ?? `${ctxKey}Id`;
  const owner = opts.owner ?? 'userId';

  return canAccess<K, T['$inferSelect']>(
    ctxKey,
    ({ input, context }) =>
      // eslint-disable-next-line ts/no-explicit-any
      service.findFirst({ where: { id: input[idKey] ?? input.id, [owner]: context.user.id, deletedAt: null } as any }),
    opts.message ?? `${ctxKey} not found`,
  );
}
