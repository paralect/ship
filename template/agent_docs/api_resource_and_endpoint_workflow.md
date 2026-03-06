# API: Resource & Endpoint Workflow

> Read this when adding or modifying API resources, endpoints, or middlewares.

---

## Resource Structure (Non-Negotiable)

Every resource lives in `apps/api/src/resources/<name>/` with this layout:

```
<name>/
├── <name>.schema.ts      # Zod schema extending dbSchema
├── <name>.service.ts      # db.createService<T>(COLLECTION_NAME, { schemaValidator })
├── index.ts               # Barrel: export service, import handler (side-effect)
├── <name>.handler.ts      # Optional: eventBus side effects
└── endpoints/             # One file per HTTP endpoint (auto-discovered)
    └── *.ts               # Each default-exports createEndpoint({...})
```

Search existing resources for reference: `grep -r "createEndpoint" apps/api/src/resources/users/endpoints/`.

---

## Add New Resource Checklist

- [ ] **Register collection name** in `packages/app-constants/src/api.constants.ts` → `DATABASE_DOCUMENTS`
- [ ] **Create schema** extending `dbSchema` from `resources/base.schema.ts` (provides `_id`, `createdOn`, `updatedOn`, `deletedOn`)
- [ ] **Create service** via `db.createService<T>(DATABASE_DOCUMENTS.NAME, { schemaValidator: (obj) => schema.parseAsync(obj) })`
- [ ] **Create barrel** `index.ts` — export service; if handler exists, `import './name.handler'` at top (side-effect)
- [ ] **Create endpoint files** in `endpoints/` — each must **default-export** `createEndpoint({...})`
- [ ] **Run codegen**: `pnpm --filter shared generate`
- [ ] **Verify**: `pnpm --filter api tsc --noEmit`
- [ ] **Check startup logs**: `[routes] POST /projects`, etc.

---

## Critical Invariants

### Auto-discovery
- Routes register automatically. No manual registration anywhere.
- Resource name = folder name = URL prefix (`resources/projects/` → `/projects/*`).
- The `token` resource is in `IGNORE_RESOURCES` and excluded from routes + codegen.

### Auth default
- Every endpoint requires auth **unless** `isPublic` is in the `middlewares` array.
- `isPublic` is a sentinel reference — the route system checks `middleware === isPublic` by identity.
- Import: `import isPublic from 'middlewares/isPublic'`.

### Validation
- If `schema` is provided, `validate` middleware auto-applies.
- Validate merges `body + files + query + params` into one object, then runs Zod.
- Result lives on `ctx.validatedData` (typed by schema).

### Handler return
- Return a value from `handler` → it becomes `ctx.body` automatically.
- For 204 no-content: set `ctx.status = 204`, return nothing.

### Imports
- API `tsconfig.baseUrl` is `src`. Use `'resources/...'`, `'routes/...'`, `'config'`, `'db'` — never `'src/...'` or deep relative paths.

### Soft deletes
- `service.deleteSoft(filter)` sets `deletedOn` timestamp instead of removing.
- All `find`/`findOne` queries auto-exclude `deletedOn !== null`.

---

## `shouldExist` Middleware

Pre-fetches a document and returns 404 if missing. The collection name must match a registered `db.createService` name.

```typescript
import shouldExist from 'routes/middlewares/shouldExist';

// With custom criteria (e.g., scope to current user):
middlewares: [
  shouldExist('projects', {
    criteria: (ctx) => ({ _id: ctx.params.projectId, userId: ctx.state.user._id }),
  }),
],
```

---

## User-Scoped CRUD Pattern

When an endpoint modifies a resource owned by the current user, scope queries by `userId` and guard with `throwError`:

```typescript
import { myService } from 'resources/my-resource';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'put',
  path: '/:id',
  schema,

  async handler(ctx) {
    const userId = ctx.state.user._id;
    const { id } = ctx.request.params;

    const doc = await myService.findOne({ _id: id, userId });

    if (!doc) {
      ctx.throwError('Not found', 404);
      return;
    }

    const updated = await myService.updateOne({ _id: id, userId }, () => ctx.validatedData);
    return updated;
  },
});
```

Key points:
- Always filter by `userId` in both the guard query and the mutation to prevent access to other users' data.
- Use `ctx.throwError(message, status?)` — not `ctx.assertError()` — to avoid TS2775 (assertion functions require explicit type annotations on `ctx`).
- For deletes, use `service.deleteSoft(filter)` and set `ctx.status = 204`.

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
- `createEndpoint` signature or behavior changes (see `apps/api/src/routes/createEndpoint.ts`)
- Route auto-discovery logic changes (see `apps/api/src/routes/routes.ts`)
- New middleware is added to `apps/api/src/middlewares/` or `apps/api/src/routes/middlewares/`
- `@paralect/node-mongo` is upgraded with API changes
- `IGNORE_RESOURCES` list changes in `packages/shared/scripts/generate.ts`
