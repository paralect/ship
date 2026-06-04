import shouldExist from '@/middlewares/should-exist';

/**
 * Mongo variant of the ownership gate. Asserts the current user owns the document identified by
 * `input[idKey]` (falling back to `input.id`), loading it into `context[ctxKey]` or throwing
 * NOT_FOUND. Matches on `_id` + owner (`userId` by default). Mirrors the postgres `shouldOwn`
 * but speaks the `@paralect/node-mongo` Service API (`findOne`) instead of Drizzle's `findFirst`.
 */
export default function shouldOwn<K extends string>(
  ctxKey: K,
  // eslint-disable-next-line ts/no-explicit-any
  service: { findOne: (query: Record<string, unknown>) => Promise<any> },
  opts: { idKey?: string; owner?: string; message?: string } = {},
) {
  const idKey = opts.idKey ?? `${ctxKey}Id`;
  const owner = opts.owner ?? 'userId';

  return shouldExist<K, unknown>(
    ctxKey,
    ({ input, context }) =>
      // eslint-disable-next-line ts/no-explicit-any
      service.findOne({ _id: input[idKey] ?? input.id, [owner]: (context.user as any)._id }),
    opts.message ?? `${ctxKey} not found`,
  );
}
