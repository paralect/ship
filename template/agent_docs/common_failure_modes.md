# Common Failure Modes

> Consult this when debugging errors or before submitting changes.

---

## 1. "Module not found" for a new endpoint/type in web

**Cause**: Codegen not run after API changes.
**Fix**: `pnpm --filter shared generate && pnpm --filter web tsc --noEmit`

## 2. Page exists but returns 404 in browser

**Cause**: File is not named `*.page.tsx`. Next.js config only routes files matching `pageExtensions: ['page.tsx', 'api.ts']`.
**Fix**: Rename to `index.page.tsx` or `[param].page.tsx`.

## 3. Endpoint returns 401 unexpectedly

**Cause**: Missing `isPublic` in the endpoint's `middlewares` array. All endpoints require auth by default.
**Fix**: Add `import isPublic from 'middlewares/isPublic'` and include it in `middlewares: [isPublic]`.

## 4. Zod validation errors: "unrecognized key" or wrong method

**Cause**: Using Zod 3 API in a Zod 4 repo. Example: `z.string().email()` doesn't exist in Zod 4.
**Fix**: Use `z.email()`, `z.url()`, `z.uuid()` etc. Check `node_modules/zod` version. Search existing schemas for patterns.

## 5. Import errors in API code: "Cannot find module 'src/...'"

**Cause**: API `tsconfig.baseUrl` is `src`. Imports should be `'resources/...'`, `'routes/...'`, `'config'`, `'db'` — no `src/` prefix.
**Fix**: Remove the `src/` prefix from the import path.

## 6. New resource's endpoints don't appear in startup logs

**Cause**: Either (a) no `endpoints/` subfolder, (b) endpoint files don't default-export `createEndpoint()`, or (c) the resource folder name is in `IGNORE_RESOURCES`.
**Fix**: Check `apps/api/src/resources/<name>/endpoints/` exists and files use `export default createEndpoint({...})`. Check `generate.ts` for `IGNORE_RESOURCES`.

## 7. `shouldExist` middleware returns "service not found"

**Cause**: The collection name passed to `shouldExist('name')` doesn't match any `db.createService` registration. Services register into `db.services` by their `DATABASE_DOCUMENTS` name.
**Fix**: Ensure the service file calls `db.createService(DATABASE_DOCUMENTS.NAME, ...)` and the barrel `index.ts` imports it (triggering registration).

## 8. `useApiMutation` pathParams don't change per call

**Cause**: `pathParams` in `useApiMutation` are bound at hook initialization, not per `mutate()` call.
**Fix**: For dynamic IDs, use `apiClient.resource.endpoint.call(params, { pathParams })` directly instead of the hook. See `agent_docs/web_pages_and_data_access.md`.

## 9. "Command not found: npm" / wrong package manager

**Cause**: Using npm or yarn. This repo requires pnpm.
**Fix**: `pnpm install`. The `engines` field in root `package.json` enforces `pnpm ≥9.5.0` and rejects yarn.

## 10. Env var undefined at runtime

**Cause**: Either (a) not added to `.env`, (b) not added to the Zod config schema, or (c) web vars missing `NEXT_PUBLIC_` prefix.
**Fix**: Add to `.env` AND the validation schema in `apps/api/src/config/index.ts` or `apps/web/src/config/index.ts`. Web vars must start with `NEXT_PUBLIC_`.

## 11. Type errors after editing `packages/shared/src/schemas/*` or `src/generated/*`

**Cause**: These files are auto-generated and overwritten by codegen.
**Fix**: Don't edit them. Edit the source in `apps/api/src/resources/`, then run `pnpm --filter shared generate`.

## 12. `eslint` reports import order violations

**Cause**: ESLint enforces strict import ordering via `simple-import-sort` with custom groups.
**Fix**: Run `pnpm --filter <package> eslint . --fix`. Don't hand-sort imports.

## 13. MongoDB connection fails locally

**Cause**: Docker infrastructure not running. MongoDB requires replica set initialization.
**Fix**: `pnpm infra` — starts MongoDB + Redis + replica set initializer.

## 14. Handler/event bus side effects not firing

**Cause**: The handler file isn't imported. Handler files must be imported as side effects in the resource's `index.ts`.
**Fix**: Add `import './<name>.handler'` at the top of the resource's `index.ts`.

---

## Update Triggers

Update this doc when:
- New recurring failure patterns are discovered
- Existing failure modes are fixed by architectural changes
- Error messages change (update the symptoms)
