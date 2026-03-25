# API: Resource & Endpoint Workflow

> Read this when adding or modifying API resources or oRPC endpoints.

---

## Resource Structure (Non-Negotiable)

Every resource lives in `apps/api/src/resources/<name>/` with this layout:

```
<name>/
├── <name>.schema.ts       # Zod schema extending dbSchema
├── <name>.service.ts      # db.createService<T>(COLLECTION_NAME, { schemaValidator })
├── index.ts               # Barrel: export service, import handler (side-effect)
├── <name>.handler.ts      # Optional: eventBus side effects
└── endpoints/            # One file per oRPC endpoint
    ├── index.ts           # Barrel: re-exports all endpoints
    ├── list.ts            # export default isAuthorized.input(...).output(...).handler(...)
    ├── update.ts
    └── remove.ts
```

Search existing resources for reference: `ls apps/api/src/resources/users/endpoints/`.

---

## Add New Endpoint

1. Create a file in `resources/<name>/endpoints/` (e.g. `create.ts`)
2. Default-export an endpoint:
   ```typescript
   import { isAuthorized } from '../../../procedures';
   export default isAuthorized.input(...).output(...).handler(async ({ input, context }) => { ... });
   ```
3. Add one line to `endpoints/index.ts`:
   ```typescript
   export { default as create } from './create';
   ```

Filename (camelCase) = endpoint name = client path: `create.ts` → `apiClient.<resource>.create`.

---

## Add New Resource Checklist

- [ ] **Register collection name** in `packages/app-constants/src/api.constants.ts` → `DATABASE_DOCUMENTS`
- [ ] **Create schema** extending `dbSchema` from `resources/base.schema.ts` (provides `_id`, `createdOn`, `updatedOn`, `deletedOn`)
- [ ] **Create service** via `db.createService<T>(DATABASE_DOCUMENTS.NAME, { schemaValidator: (obj) => schema.parseAsync(obj) })`
- [ ] **Create barrel** `index.ts` — export service; if handler exists, `import './name.handler'` at top (side-effect)
- [ ] **Create `endpoints/` directory** with individual endpoint files (default exports) + barrel `index.ts`
- [ ] **Register in router** — add import + entry to `src/router.ts`:
  ```typescript
  import * as myResource from './resources/my-resource/endpoints';
  // in the router object: myResource: isPublic.router(myResource),
  ```
- [ ] **Verify**: `pnpm --filter api tsc --noEmit`

---

## Critical Invariants

### Endpoints directory
- Resource name = folder name = router key (`resources/users/` → `apiClient.users.*`).
- Each `.ts` file in `endpoints/` (except index.ts) default-exports one endpoint.
- `endpoints/index.ts` re-exports all endpoints — add one line per new file.
- Filenames are camelCase: `forgotPassword.ts` → `forgotPassword`.
- New resources also need an import + entry in `src/router.ts`.
- The `token` resource has no endpoints — it's an internal service only.

### Auth
- Use `isPublic` (from `src/procedures.ts`) for public endpoints — no auth required.
- Use `isAuthorized` for protected endpoints — requires a valid user in context.
- `isAuthorized` provides `context.user` typed as `User`.

### Validation
- Use `.input(zodSchema)` for input validation — oRPC validates automatically.
- Use `.output(zodSchema)` for output validation — required for type inference to web.
- Always provide `.output()` so types flow correctly to the web client.

### Handler return
- Return a value from `handler` → oRPC serializes it as the response.
- For empty responses, use `z.object({})` output and `return {}`.

### Imports in procedure files
- Endpoint files MUST use **relative imports** for anything in the type chain (procedures, types, schemas, services).
- `app-constants` is fine as a bare import (separate package).
- This is required because TypeScript must resolve these imports when building declarations for the web client.

### Soft deletes
- `service.deleteSoft(filter)` sets `deletedOn` timestamp instead of removing.
- All `find`/`findOne` queries auto-exclude `deletedOn !== null`.

---

## `shouldExist` Middleware

Real oRPC middleware that loads an entity by `input.id` and throws NOT_FOUND if missing. Defined in `src/middlewares.ts`, used via `.use()` after `.input()`.

```typescript
import { shouldExist } from '../../../middlewares';
import { userService } from '..';

export default isAuthorized
  .input(z.object({ id: z.string(), data: ... }))
  .use(shouldExist((id) => userService.findOne({ _id: id }), 'User'))
  .output(publicUserOutput)
  .handler(async ({ input }) => {
    return userService.updateOne({ _id: input.id }, () => input.data);
  });
```

The middleware must be placed **after** `.input()` so it receives the validated input with `id`.

---

## User-Scoped CRUD Pattern

When a procedure modifies a resource owned by the current user, scope queries by `userId`:

```typescript
export default isAuthorized
  .input(z.object({ id: z.string(), data: schema }))
  .use(shouldExist((id) => myService.findOne({ _id: id }), 'Resource'))
  .output(outputSchema)
  .handler(async ({ input }) => {
    return myService.updateOne({ _id: input.id }, () => input.data);
  });
```

---

## Service API Quick Reference

`db.createService` returns a `@paralect/node-mongo` Service. Key methods:
- `find(filter, { page, perPage }, { sort })` → `{ results, pagesCount, count }`
- `findOne(filter)`, `insertOne(doc)`, `updateOne(filter, updateFn)`, `deleteSoft(filter)`
- `exists(filter)`, `distinct(field, filter)`, `countDocuments(filter)`
- `atomic.updateOne(filter, update)` — raw MongoDB update (bypass schema validator)
- `createIndex(keys, options?)` — call at module level in the service file

Event bus: `eventBus.on('collectionName.created' | '.updated' | '.deleted', handler)`.

---

## Update Triggers

Update this doc when:
- oRPC procedure patterns change
- New shared middleware/helper is added to `apps/api/src/middlewares.ts`
- `@paralect/node-mongo` is upgraded with API changes
- Router registration pattern changes in `src/router.ts`
