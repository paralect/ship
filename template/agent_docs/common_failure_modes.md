# Common Failure Modes

> Consult this when debugging errors or before submitting changes.

---

## 1. Endpoint returns 404

**Cause**: Codegen not run after adding/removing endpoint file.
**Fix**: `cd apps/api && npx tsx scripts/codegen-router.ts`

## 2. Web types stale after API changes

**Cause**: Declarations not rebuilt.
**Fix**: `pnpm --filter api build:types && pnpm --filter web tsc --noEmit`.

## 3. Import error: "Cannot find module '@/...'"

**Cause**: API uses `@/` alias (baseUrl: `src`). Wrong path or missing file.
**Fix**: Check that the file exists at `apps/api/src/<path>`.

## 4. Inline string enum in Zod schema

**Cause**: Using `z.enum(['ready', 'failed'])` instead of constants.
**Fix**: Import from `app-constants`: `z.enum(STATUSES)`.

## 5. Page exists but returns 404 in browser

**Cause**: File not named `*.page.tsx`.
**Fix**: Rename to `index.page.tsx` or `[param].page.tsx`.

## 6. Env var undefined at runtime

**Cause**: Not in `.env` or not in the Zod config schema. Web vars need `NEXT_PUBLIC_` prefix.
**Fix**: Add to both `.env` and `src/config/index.ts` schema.

## 7. Postgres connection fails locally

**Cause**: Docker not running.
**Fix**: `pnpm infra`

## 8. tsbuildinfo cache causes stale declarations

**Cause**: Stale incremental build cache.
**Fix**: `rm -f apps/api/tsconfig.tsbuildinfo && pnpm --filter api build:types`

## 9. `shouldExist` — entity not found

**Cause**: Wrong filter or entity doesn't exist in DB.
**Fix**: Check the finder function. `shouldExist((id) => db.users.findFirst({ where: { id } }), 'Name')`.

## 10. Router codegen produces wrong nesting

**Cause**: Non-param subdirectories inside `endpoints/` become nested router groups (camelCased). Param dirs (`[id]/`) are part of the URL path, not nesting.
**Fix**: Understand the convention: `endpoints/nested-dir/action.post.ts` → `resource.nestedDir.action`. Only `[param]/` dirs add URL segments.

## 11. Wrong pnpm/node version

**Cause**: Using npm/yarn or wrong Node version.
**Fix**: `nvm use` (reads `.nvmrc`), use pnpm only.

## 12. Pre-existing db.ts type errors

**Cause**: Drizzle version compatibility issue with `PgTable.getSQL`. Known, not blocking.
**Fix**: Ignore. Use `--skipLibCheck --noCheck` for declaration emission. These don't affect runtime.
