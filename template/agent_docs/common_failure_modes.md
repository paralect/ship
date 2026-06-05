# Common Failure Modes

> Consult this when debugging errors or before submitting changes.

---

## 1. Endpoint returns 404

**Cause**: Codegen not run after adding/removing endpoint file.
**Fix**: `pnpm --filter api codegen` (regenerates router + db + contract).

## 2. Web types stale after API changes

**Cause**: Declarations not rebuilt.
**Fix**: `pnpm --filter api build:types && pnpm --filter web tsc --noEmit`.

## 3. Import error: "Cannot find module '@/...'"

**Cause**: API uses `@/` alias (baseUrl: `src`). Wrong path or missing file.
**Fix**: Check that the file exists at `apps/api/src/<path>`.

## 4. Inline string enum in Zod schema

**Cause**: Using `z.enum(['ready', 'failed'])` instead of constants.
**Fix**: Import from `app-constants`: `z.enum(STATUSES)`.

## 5. Route exists but 404 in browser

**Cause**: TanStack Router route tree (`src/routeTree.gen.ts`) hasn't regenerated, or the file is under a `-components/` prefix.
**Fix**: Restart `pnpm --filter web dev` to retrigger the Vite Start plugin. Confirm the file path matches a real URL segment and that `-`-prefixed directories are only used for non-route helpers.

## 6. Env var undefined at runtime

**Cause**: Not in `.env` or not in the Zod config schema. Web vars need `VITE_` prefix (Vite convention).
**Fix**: Add to both `.env` and `src/config/index.ts` schema.

## 7. Postgres connection fails locally

**Cause**: Docker not running.
**Fix**: `pnpm infra:postgres`

## 8. tsbuildinfo cache causes stale declarations

**Cause**: Stale incremental build cache.
**Fix**: `rm -f apps/api/tsconfig.tsbuildinfo && pnpm --filter api build:types`

## 9. `canAccess` — entity not found

**Cause**: Wrong filter or entity doesn't exist in DB.
**Fix**: Check the `load` function. `canAccess(ctxKey, ({ input, context }) => db.users.findFirst({ where: { id: input.id } }), message?)` loads into `context[ctxKey]`. For the common owned-by-id case use `canEdit(ctxKey, db.users, { owner: 'userId' })`, which resolves `input.<ctxKey>Id ?? input.id`, matches `owner` against `context.user.id`, and is soft-delete aware.

## 10. Router codegen produces wrong nesting

**Cause**: Non-param subdirectories inside `endpoints/` become nested router groups (camelCased). Param dirs (`[id]/`) are part of the URL path, not nesting.
**Fix**: Understand the convention: `endpoints/nested-dir/action.post.ts` → `resource.nestedDir.action`. Only `[param]/` dirs add URL segments.

## 13. `tx.<resource>` is `any` inside a transaction

**Cause**: Drizzle's `transaction()` callback was used directly instead of `db.transaction()`.
**Fix**: Always use `db.transaction(async (tx) => {...})`. The `tx` argument is the same typed `DBType` as `db`, so `tx.users.insertOne(...)` etc. all stay typed.

## 14. `eventBus.on('users.update', ...)` handler never fires

**Cause**: codegen-db only wires `DbService` to the event bus when the resource has a `handlers/` directory at codegen time. Without it, the `onMutation` callback is omitted.
**Fix**: Ensure `apps/api/src/resources/<name>/handlers/` exists with at least one file. Re-run `pnpm --filter api codegen`. The generated `db.ts` should show `new DbService(<table>, db, '<name>', eventBus.hook('<name>'))`.

## 11. Wrong pnpm/node version

**Cause**: Using npm/yarn or wrong Node version.
**Fix**: `nvm use` (reads `.nvmrc`), use pnpm only.

## 12. Pre-existing db.ts type errors

**Cause**: Drizzle version compatibility issue with `PgTable.getSQL`. Known, not blocking.
**Fix**: Ignore. Use `--skipLibCheck --noCheck` for declaration emission. These don't affect runtime.
