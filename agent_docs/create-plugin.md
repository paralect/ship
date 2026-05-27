Create a new Ship plugin. The user will describe what feature the plugin should provide.

## What is a plugin

A plugin is a directory under `plugins/` containing API resources (endpoints, schemas, methods/handlers) and/or web routes that get merged into the Ship template by `pnpm plugin:dev` / `pnpm plugin:install`. See `PLUGINS.md` at the repo root for the system-level docs.

## Plugin layout

The template's web app is now **TanStack Start (SPA mode) + TanStack Router (file-based routes)**. Plugin web routes live under `web/routes/...` and merge into `template/apps/web/routes/...`. (Plugin merger flattens `plugin/web/X/...` → `apps/web/src/X/...`, so don't add an extra `src/` step.)

> Older plugins still on `web/pages/*.page.tsx` are pre-migration — `apps/web/src/pages/` is no longer a TanStack Router-recognised location, so those plugins won't expose routes until converted.

### Without database

```
plugins/<name>/
  plugin.json
  api/
    src/resources/<name>/
      endpoints/*.ts
      methods/*.ts
  packages/                            # optional monorepo packages
    <pkg-name>/
      package.json
      src/index.ts
  web/
    routes/_authenticated/app/<name>/index.tsx   # → apps/web/routes/_authenticated/app/<name>/index.tsx
```

### With database (multi-DB support)

```
plugins/<name>/
  plugin.json
  _postgres_api/api/src/resources/<name>/
    <name>.schema.ts                   # Drizzle pgTable + Zod schemas
    endpoints/*.ts
  _mongo_api/api/src/resources/<name>/
    <name>.schema.ts                   # Zod schema for MongoDB
    endpoints/*.ts
  web/
    routes/_authenticated/app/<name>/index.tsx
```

The plugin system detects which DB plugin (`postgres` or `mongo`) is in the install list and merges the matching `_*_api/` directory.

## plugin.json

```json
{
  "name": "<plugin-name>",
  "version": "1.0.0",
  "description": "<what it does>",
  "requires": ["postgres"],
  "dependencies": {
    "api": { "some-package": "^1.0.0" },
    "web": { "some-ui-lib": "^2.0.0" }
  }
}
```

- `requires` documents which plugins must be installed alongside this one (e.g. `["postgres", "auth-starter"]` for the canonical admin plugin).
- `dependencies` are installed into `plugin-dev-server/` during `plugin:dev`.
- Use `"workspace:*"` for dependencies on packages included in the plugin's `packages/` directory.

## Web route conventions (TanStack Router)

Each `.tsx` file under `web/routes/...` is a route. Examples:

| File | Route |
|---|---|
| `web/routes/_authenticated/app/notes/index.tsx` | `/app/notes` |
| `web/routes/_authenticated/app/notes/$noteId.tsx` | `/app/notes/:noteId` |
| `web/routes/_authenticated/app/admin/index.tsx` | `/app/admin` |

Files under `-components/` are private helpers, not routes (the leading `-` is the TanStack Router convention to opt out of routing).

Each route file exports `Route` via `createFileRoute(...)`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { Table } from '@/components';
import { useApiQuery } from '@/hooks';
import { apiClient } from '@/services/api-client.service';

export const Route = createFileRoute('/_authenticated/app/notes/')({
  component: NotesPage,
});

function NotesPage() {
  const { data, isLoading } = useApiQuery(apiClient.notes.list);
  // …
}
```

Auth is enforced by the parent `_authenticated.tsx` layout that lives in the template. Don't reimplement the guard in your plugin.

After dropping a route file, the Vite Start plugin regenerates `template/apps/web/src/routeTree.gen.ts` automatically on save.

## API endpoint conventions

Each file in `endpoints/` exports a default oRPC procedure:

```typescript
import { z } from 'zod';

import db from '@/db';
import { isAuthorized, ORPCError } from '@/procedures';

const inputSchema = z.object({ /* … */ });

export default isAuthorized
  .input(inputSchema)
  .output(/* … */)
  .handler(async ({ context, input }) => {
    // context.user is the authenticated user
    return db.things.insertOne({ userId: context.user.id, name: input.name });
  });
```

Procedure builders: `isPublic` (no auth), `isAuthorized` (logged in), `isAdmin` (admin only). `ORPCError` is re-exported from `@/procedures`.

### Postgres schemas

```typescript
// _postgres_api/api/src/resources/things/things.schema.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const things = pgTable('things', {
  ...baseColumns,
  name: text().notNull(),
  userId: uuid().notNull().references(() => users.id),
});
```

`baseColumns` provides: `id` (uuid), `createdAt`, `updatedAt`, `deletedAt` (soft delete). Snake-case column names are auto-derived via `casing: 'snake_case'` in `drizzle.config.ts`.

Codegen-db auto-creates `db.things` with a `DbService<typeof things>` instance. Methods: `find`, `findFirst`, `findPage`, `count`, `insertOne`, `insertMany`, `updateOne`, `transaction`.

Add a `handlers/` directory in your resource to subscribe to mutation events on the typed event bus (`<table>.insert | update | delete`). See `apps/api/src/resources/users/handlers/` for the canonical pattern.

### MongoDB schemas

```typescript
// _mongo_api/api/src/resources/things/things.schema.ts
import { z } from 'zod';

import { dbSchema } from '@/resources/base.schema';

const schema = dbSchema.extend({
  name: z.string().min(1),
  userId: z.string(),
});

export default schema;

export const indexes = [
  { fields: { userId: 1 }, options: {} },
] as const;
```

`dbSchema` provides: `_id`, `createdAt`, `updatedAt`, `deletedAt`.

## Key API differences between DB implementations

| Concept | PostgreSQL | MongoDB |
|---------|------------|---------|
| ID field | `context.user.id` | `context.user._id` |
| Check exists | `db.things.findFirst({ where: { email } })` | `db.things.findOne({ email })` |
| Filter syntax | `{ where: { userId, deletedAt: null } }` | `{ userId, deletedAt: null }` |
| Find list | `db.things.find({ where })` returns array | `db.things.find({...})` returns `{ results, count, pagesCount }` |
| Update | `db.things.updateOne({ id }, data)` | `db.things.updateOne({ _id }, updateFn)` |

## Web data access (in plugin pages)

Use the same hooks/services that the template ships:

```tsx
import { useApiQuery, useApiMutation, useApiForm, queryKey } from '@/hooks';
import { apiClient } from '@/services/api-client.service';
```

Reusable widgets the template carries:
- `@/components/Table` — TanStack Table wrapper with sort/pagination/loading/empty states.
- `@/components/app-drawer` — right-side sheet for forms.
- `@/components/pill-tab-bar` — pill-style tab navigation.
- `@/layouts/main-layout/content-layout` — back-button + bordered card chrome.
- Anything under `@/components/ui/*` (shadcn primitives).

## Testing locally

```bash
# Terminal 1: infra
cd template && pnpm infra:postgres   # or pnpm infra:mongo

# Terminal 2: plugin dev merge
pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/<name>
```

`plugin:dev` watches the listed plugins and re-merges them into `template/plugin-dev-server/` on change. Then `pnpm --filter web dev` / `pnpm --filter api dev` reads from there.

## Steps to create a plugin

1. Create `plugins/<name>/plugin.json` with `requires` and any `dependencies`.
2. If it needs a database, create `_postgres_api/` (and `_mongo_api/` if dual-DB is desired) with the schemas and endpoints.
3. Create web routes under `web/routes/...` following TanStack Router conventions.
4. Test with `pnpm plugin:dev`.

## Reference

- `plugins/admin/` — canonical TanStack Router plugin (admin user list, requires `postgres` + `auth-starter`).
- `plugins/notes/` — minimal example with schema, 3 endpoints, and a page (both DB variants — note this is still Next.js pages; convert when touched).
- `plugins/auth-starter/` — better-auth wiring (API only; web routes promoted to the template).
- `plugins/ai-chat/` — example with a monorepo package (`packages/ai`) for shared AI logic.
