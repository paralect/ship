import canAccess from '@/middlewares/can-access';

export default function canEdit<K extends string>(
  ctxKey: K,
  // eslint-disable-next-line ts/no-explicit-any
  service: { findOne: (query: Record<string, unknown>) => Promise<any> },
  opts: { idKey?: string; owner?: string; message?: string } = {},
) {
  const idKey = opts.idKey ?? `${ctxKey}Id`;
  const owner = opts.owner ?? 'userId';

  return canAccess<K, unknown>(
    ctxKey,
    ({ input, context }) =>
      // eslint-disable-next-line ts/no-explicit-any
      service.findOne({ _id: input[idKey] ?? input.id, [owner]: (context.user as any)._id }),
    opts.message ?? `${ctxKey} not found`,
  );
}
