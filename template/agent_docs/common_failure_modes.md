# Common Failure Modes

> Consult this when debugging errors or before submitting changes.

---

## 1. Page exists but returns 404 in browser

**Cause**: File not named `*.page.tsx`.
**Fix**: Rename to `index.page.tsx` or `[param].page.tsx`.

## 2. oRPC procedures return 404

**Cause**: Procedure not registered. Either missing from `procedures/index.ts` barrel or missing from `src/router.ts`.
**Fix**: Add `export { default as name } from './name'` to the barrel and `import * as resource from './resources/resource/procedures'` + router entry in `src/router.ts`.

## 3. Web types stale after API procedure changes

**Cause**: Declarations not rebuilt.
**Fix**: `pnpm --filter api build:types && pnpm --filter web tsc --noEmit`.

## 4. "Unknown procedure — not found in orpc client"

**Cause**: Passing a raw object instead of a stable client reference to `useApiQuery`/`queryKey`.
**Fix**: Always use `apiClient.resource.procedure` from `services/api-client.service`.

## 5. Import errors in API: "Cannot find module 'src/...'"

**Cause**: API `tsconfig.baseUrl` is `src` — no `src/` prefix needed.
**Fix**: Use `'resources/...'`, `'config'`, `'db'`, etc.

## 6. Procedure files in `procedures/` use bare imports and declarations break

**Cause**: Files in `procedures/` must use relative imports for the type chain to work.
**Fix**: Use `../../../procedures`, `../../users`, etc. inside procedure files.

## 7. `shouldExist` — entity not found

**Cause**: Wrong filter or entity doesn't exist in DB.
**Fix**: Check the finder function. `shouldExist(() => service.findOne({ _id: id }), 'Name')`.

## 8. Env var undefined at runtime

**Cause**: Not in `.env` or not in the Zod config schema. Web vars need `NEXT_PUBLIC_` prefix.
**Fix**: Add to both `.env` and the validation schema.

## 9. MongoDB connection fails locally

**Cause**: Docker not running.
**Fix**: `pnpm infra`.

## 10. Handler/event bus side effects not firing

**Cause**: Handler file not imported as side effect.
**Fix**: Add `import './<name>.handler'` at top of resource's `index.ts`.

## 11. Wrong pnpm/node version

**Cause**: Using npm/yarn or wrong Node version.
**Fix**: `nvm use` (reads `.nvmrc`), `pnpm install`.

## 12. tsbuildinfo cache causes stale declarations

**Cause**: Stale incremental build cache.
**Fix**: `rm -f apps/api/tsconfig.tsbuildinfo && pnpm --filter api build:types`.
