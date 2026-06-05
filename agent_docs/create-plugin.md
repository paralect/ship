# Create a Ship plugin

Build a new Ship plugin. The user describes the feature; you assemble a directory under `plugins/<name>/` that **merges into the codebase** — API resources into `apps/api/src/resources/`, web routes into `apps/web/src/routes/`, shared code into `packages/`. Like shadcn/ui: install copies the files in, and from then on they're the user's code to edit.

System-level docs live in `PLUGINS.md` at the repo root. This file is the authoring guide.

## How a plugin merges

A plugin is a folder of files laid out to mirror where they land in a scaffolded project. The merger copies **new files only** — the template's curated files (codegen scripts, `migrate.ts`, `auth.ts`, `db.ts`, baseline resources, configs) always win. Plugins contribute *new* resources, endpoints, routes, and packages; they never overwrite template files.

Three destinations:

| Plugin path | Lands at | Merge rule |
|---|---|---|
| `<name>/postgres/api/resources/<res>/**` | `apps/api/src/resources/<res>/**` | copy new files only |
| `<name>/api/src/**` | `apps/api/src/**` | copy new files only |
| `<name>/web/<dir>/**` | `apps/web/src/<dir>/**` | copy new files only |
| `<name>/packages/<pkg>/**` | `packages/<pkg>/**` | copied only if `<pkg>` doesn't already exist |

The web merge flattens `<name>/web/X/...` → `apps/web/src/X/...`, so **don't add an extra `src/` step** in the plugin layout. After files land, the CLI runs `pnpm --filter api codegen` and (for the API) `pnpm --filter api generate`, so new endpoints and tables are wired into `src/router.ts` / `src/db.ts` and the migration set automatically. (Source of the merge logic: `packages/create-ship-app/src/create-app.ts`.)

## Plugin layout

PostgreSQL is the single database path. A plugin that needs the DB puts its resource under a `postgres/api/` directory; a plugin that's pure UI (or pure backend) skips it.

### Web-only plugin (consumes existing endpoints)

The canonical example, `plugins/admin`, is exactly this shape — an admin user list that reads the template's `users.list` endpoint, so it ships **no API code at all**:

```
plugins/admin/
  plugin.json
  web/
    routes/_authenticated/app/admin/
      index.tsx                      # → apps/web/src/routes/_authenticated/app/admin/index.tsx  (/app/admin)
      -components/
        constants.ts                 # private helpers (the leading `-` opts out of routing)
        filters.tsx
```

### Plugin with its own resource (endpoints + table + UI)

`plugins/notes` adds a `notes` table, three endpoints, an ownership gate, and a page:

```
plugins/notes/
  plugin.json
  postgres/api/resources/notes/
    notes.schema.ts                  # Drizzle pgTable (+ colocated Zod schemas)
    endpoints/
      list.ts                        # GET    /notes
      create.ts                      # POST   /notes
      remove.ts                      # DELETE /notes/{id}
    middlewares/
      can-edit-note.ts               # per-resource ownership gate
    handlers/*.ts                    # optional — mutation-event side effects
    crons/*.ts                       # optional — scheduled jobs
  web/
    routes/_authenticated/app/notes/index.tsx   # → /app/notes
```

### Plugin with a shared package

Plugins can ship monorepo packages under `packages/<pkg>/` (e.g. `ai-chat` ships `@ship/ai`). They land at `packages/<pkg>/` and are referenced as workspace deps:

```
plugins/<name>/
  packages/
    my-lib/
      package.json                   # { "name": "@ship/my-lib", ... }
      src/index.ts
```

## plugin.json

```json
{
  "name": "notes",
  "version": "1.0.0",
  "description": "Notes plugin with CRUD endpoints and UI",
  "requires": ["postgres"],
  "dependencies": {
    "api": { "some-package": "^1.0.0" },
    "web": { "some-ui-lib": "^2.0.0" }
  }
}
```

- `requires` lists plugins that must be installed alongside this one. `notes` requires `["postgres"]`; `admin` requires `["postgres", "auth-starter"]`.
- `dependencies.api` / `dependencies.web` are appended to `apps/api/package.json` / `apps/web/package.json` on merge. Use `"workspace:*"` for a package shipped in this plugin's `packages/`.

## Web routes (TanStack Router)

The web app is **TanStack Start (SPA mode) + TanStack Router** with file-based routes. Every `.tsx` file under `web/routes/...` is a route:

| File | Route |
|---|---|
| `web/routes/_authenticated/app/notes/index.tsx` | `/app/notes` |
| `web/routes/_authenticated/app/notes/$noteId.tsx` | `/app/notes/:noteId` |
| `web/routes/_authenticated/app/admin/index.tsx` | `/app/admin` |

Folders beginning with `-` (e.g. `-components/`) are private — TanStack Router skips them for routing. Use them to colocate route-local helpers and components.

Each route file exports `Route` via `createFileRoute(...)`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { useApiQuery } from '@/hooks';
import { apiClient } from '@/services/api-client.service';

export const Route = createFileRoute('/_authenticated/app/notes/')({
  component: NotesPage,
});

function NotesPage() {
  const { data: notes = [], isLoading } = useApiQuery(apiClient.notes.list);
  // …
}
```

Auth is enforced by the `_authenticated` layout the **Auth plugin** ships into the template — don't reimplement the guard in your plugin. Placing routes under `web/routes/_authenticated/app/...` is what puts them behind sign-in and inside the app shell.

After a route file lands, the Vite Start plugin regenerates `apps/web/src/routeTree.gen.ts` automatically; you never edit it by hand.

### Show your feature in the app sidebar

The app sidebar builds itself from route metadata — no central list to edit. A route opts in by declaring `staticData.nav`; the sidebar (in the Auth plugin's app shell) scans the route tree and renders an item for each, sorted by `order`:

```tsx web/routes/_authenticated/app/notes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { FileText } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/app/notes/')({
  staticData: { nav: { label: 'Notes', icon: FileText, order: 10 } },
  component: NotesPage,
});
```

`icon` is a lucide-react component; `order` is optional (lower sorts first). Install the plugin and the feature appears in the sidebar automatically.

### Web data access

Use the hooks and client the template (via the Auth plugin) already ships:

```tsx
import { queryKey, useApiMutation, useApiQuery, useQueryClient } from '@/hooks';
import { apiClient } from '@/services/api-client.service';

const { data, isLoading } = useApiQuery(apiClient.notes.list);

const createMutation = useApiMutation(apiClient.notes.create, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKey(apiClient.notes.list) });
  },
});
```

`apiClient` is the typed oRPC client — `apiClient.<resource>.<endpoint>` is fully typed from the API's `.input()` / `.output()` schemas, so a renamed field surfaces as a type error in the route. Reusable widgets you can lean on: `@/components/Table` (sort/pagination/empty/loading), `@/components/app-drawer`, `@/components/ui/*` (shadcn primitives), `@/layouts/*`.

## API endpoints (oRPC)

Each file in `endpoints/` default-exports an oRPC endpoint built on `@/endpoint` — the shared builder with every `@/middlewares/global` already applied. Mounting is by file path: `list.ts` → `GET`, `create.ts` → `POST`, `[id]/update.ts` → `PUT /{id}` (you can also pin the route explicitly with `.route({ method, path })`, as `notes` does).

```ts
import { z } from 'zod';

import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';

const inputSchema = z.object({ text: z.string().min(1).max(1000) });

export default endpoint
  .use(isAuthorized)
  .input(inputSchema)
  .output(z.object({ id: z.string(), text: z.string() }))
  .handler(async ({ context, input }) => {
    // context.user is the authenticated user
    return db.notes.insertOne({ userId: context.user.id, text: input.text });
  });
```

`.input()` / `.output()` Zod schemas are the contract: they validate at runtime **and** are the types the web client sees. After adding or removing endpoint files, codegen rebuilds `src/router.ts` and `src/contract.ts` (`pnpm --filter api codegen`); during install the CLI runs this for you.

### Gates compose with `.use()`

Authorization is middleware you stack onto an endpoint — no scattered `if` checks:

| Gate | Import | Guarantees |
|---|---|---|
| `isAuthorized` | `@/middlewares/is-authorized` | a signed-in `context.user` |
| `isAdmin` | `@/middlewares/is-admin` | the user is an admin |
| `canAccess(key, load)` | `@/middlewares/can-access` | loads an entity into `context[key]`, or throws `NOT_FOUND` |
| `canEdit(key, service)` | `@/middlewares/can-edit` | the current user owns the entity (or `NOT_FOUND` — no existence leak) |

`canEdit` is built on `canAccess`. A public endpoint is just `endpoint.input(...)` with no gate. `ORPCError` (for custom failures) comes from `@orpc/server`.

Per-resource ownership lives in `<resource>/middlewares/can-edit-*.ts` — a configured `canEdit(...)`:

```ts
// resources/notes/middlewares/can-edit-note.ts
import db from '@/db';
import canEdit from '@/middlewares/can-edit';

// Loads the current user's note (by `id`) into `context.note`, or throws NOT_FOUND.
export default canEdit('note', db.notes, { message: 'Note not found' });
```

Apply it **after `.input()`** so it can read the validated input, then read the loaded entity from `context.note`:

```ts
import { z } from 'zod';

import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import canEditNote from '@/resources/notes/middlewares/can-edit-note';

export default endpoint
  .use(isAuthorized)
  .route({ method: 'DELETE', path: '/notes/{id}' })
  .input(z.object({ id: z.string() }))
  .use(canEditNote)
  .output(z.void())
  .handler(async ({ input }) => {
    await db.notes.deleteOne({ id: input.id });
  });
```

### Schemas

Colocate the Drizzle table and its Zod schemas in `resources/<name>/<name>.schema.ts`:

```ts
import { pgTable, text } from 'drizzle-orm/pg-core';

import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const notes = pgTable('notes', {
  ...baseColumns,
  text: text().notNull(),
  userId: text().notNull().references(() => users.id),
});
```

`baseColumns` provides `id` (uuid), `createdAt`, `updatedAt`, and `deletedAt` (soft delete). Snake-case column names are auto-derived (`casing: 'snake_case'`). Pull enums/constants from the `app-constants` package — never inline string enums.

`codegen-db` turns each `pgTable` export into a typed `db.<table>` service. Methods: `find`, `findFirst`, `findPage`, `count`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`, plus `db.transaction(...)`. The filter API is uniform: `where: { col: value | { eq, ne, gt, gte, lt, lte, like, ilike, in, notIn, isNull, isNotNull }, OR, AND }`, `orderBy`, and `with` / `columns` for relations. Always filter soft-deleted rows with `deletedAt: null`.

### Handlers (mutation events)

Every write emits a typed `MutationEvent` (`{ type, docs, prevDocs }`). Drop a file in `<resource>/handlers/` to react — sync analytics, push over a socket, denormalise — decoupled from the endpoint that caused the change:

```ts
// resources/notes/handlers/to-sockets.ts
import { eventBus } from '@/event-bus';
import ioEmitter from '@/io-emitter';

eventBus.on('notes.update', (data) => {
  for (const note of data.docs) {
    ioEmitter.publishToUser(note.userId, 'note:updated', note);
  }
});
```

See `apps/api/src/resources/users/handlers/` for the canonical pattern.

### Crons (scheduled jobs)

A plugin can add scheduled work by dropping a file in `<resource>/crons/*.ts` — auto-discovered the same way endpoints are. One file default-exports a `scheduler({ cron, handler })`:

```ts
// resources/notes/crons/purge-deleted.ts
import db from '@/db';
import scheduler from '@/scheduler';

export default scheduler({
  cron: '0 3 * * *',
  handler: async () => {
    await db.notes.deleteMany({ where: { deletedAt: { isNotNull: true } } });
  },
});
```

Run the scheduler with `pnpm --filter api schedule` (or `schedule-dev` in development).

## Testing locally

```bash
# Terminal 1 — infrastructure
cd template && pnpm infra:postgres

# Terminal 2 — merge + run the plugin against the template
pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/notes
```

`plugin:dev` copies the template into `plugin-dev-server/`, merges the listed plugins (copy-new-files-only), installs their dependencies, runs codegen and `db:push`, starts the dev server, and **re-merges on change**. Inspect the running app via the dev dashboards: Scalar API reference at `http://localhost:3001/docs`, Drizzle Studio at `https://local.drizzle.studio` (`pnpm dashboard`).

## Steps to create a plugin

1. Create `plugins/<name>/plugin.json` with `requires` and any `dependencies`.
2. If it needs the database, add `postgres/api/resources/<name>/` with the schema, endpoints, and any `middlewares/can-edit-*.ts`, `handlers/`, or `crons/`.
3. Add web routes under `web/routes/_authenticated/app/<name>/...` following TanStack Router conventions.
4. Test with `pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/<name>`.

## Reference plugins

- `plugins/admin` — **canonical example.** Web-only plugin (no API code); admin user list at `/app/admin`, reading the template's `users.list`. Requires `postgres` + `auth-starter`.
- `plugins/notes` — CRUD example: a `notes` table, three endpoints, a `can-edit-note` gate, and a page.
- `plugins/auth-starter` — the Auth plugin: better-auth API wiring plus the web auth pages, app shell, and the oRPC client/hooks the base app builds on.
- `plugins/ai-chat` — ships a monorepo package (`@ship/ai`) for shared AI logic.

---

## Legacy: MongoDB (kept in repo, not offered by the CLI)

PostgreSQL is the single supported database. Some plugins still keep a `mongo/api/resources/<name>/` directory in the repo from before the consolidation, and the merger will use it if a `mongo` backend is selected — but the CLI does not offer MongoDB as a database option, so you do not author or maintain it for new plugins. **Build every new plugin against PostgreSQL (`postgres/api/...`) only.**
