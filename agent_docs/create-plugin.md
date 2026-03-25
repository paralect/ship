Create a new Ship plugin. The user will describe what feature the plugin should provide.

## What is a plugin

A plugin is a directory under `plugins/` containing API resources (endpoints, schemas, methods) and/or web pages that get merged into the Ship template. See `PLUGINS.md` at the repo root for full documentation.

## Plugin structure

### Without database

```
plugins/<name>/
  plugin.json
  api/
    src/resources/<name>/
      endpoints/*.ts
      methods/*.ts
  web/
    pages/app/<name>/index.page.tsx
```

### With database (multi-DB support)

```
plugins/<name>/
  plugin.json
  _postgres_api/
    api/src/resources/<name>/
      <name>.schema.ts               # Drizzle pgTable
      endpoints/*.ts                 # PostgreSQL-specific endpoints
  _mongo_api/
    api/src/resources/<name>/
      <name>.schema.ts               # Zod schema for MongoDB
      endpoints/*.ts                 # MongoDB-specific endpoints
  web/
    pages/app/<name>/index.page.tsx   # Shared UI
```

The plugin system detects which DB plugin (`postgres` or `mongodb`) is in the list and merges the matching `_*_api/` directory.

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

- `requires` documents which plugins must be included alongside this one
- `dependencies` are installed into `plugin-dev-server/` during `plugin:dev`

## Key conventions

### API endpoints

Each file in `endpoints/` exports a default oRPC procedure:

```typescript
import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({ /* ... */ });

export default isAuthorized
  .input(inputSchema)
  .handler(async ({ context, input }) => {
    // context.user is the authenticated user
    return db.things.insertOne({ userId: context.user._id, name: input.name });
  });
```

Procedure builders: `isPublic` (no auth), `isAuthorized` (logged in), `isAdmin` (admin only).

### PostgreSQL schemas

```typescript
// _postgres_api/api/src/resources/things/things.schema.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const things = pgTable('things', {
  ...baseColumns,
  name: text('name').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
});
```

`baseColumns` provides: `id` (uuid), `createdAt`, `updatedAt`, `deletedAt`.

The codegen auto-creates `db.things` with a `DbService` instance. Methods: `find`, `findFirst`, `findPage`, `count`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`.

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

`dbSchema` provides: `_id` (string), `createdAt`, `updatedAt`, `deletedAt`.

MongoDB services are auto-discovered by `init-db.ts`. Access via `db.things` with methods: `findOne`, `find`, `exists`, `insertOne`, `updateOne`, `deleteOne`, `distinct`.

### Key differences between DB implementations

| Concept | PostgreSQL | MongoDB |
|---------|------------|---------|
| ID field | `context.user.id` | `context.user._id` |
| Check exists | `db.things.findFirst({ where: { email } })` | `db.things.findOne({ email })` |
| Filter syntax | `{ where: { userId, deletedAt: null } }` | `{ userId, deletedAt: null }` |
| Find list | `db.things.find({ where: {...} })` returns array | `db.things.find({...})` returns `{ results, count, pagesCount }` |
| Insert | `db.things.insertOne({...})` | `db.things.insertOne({...})` |
| Update | `db.things.updateOne({ id }, data)` | `db.things.updateOne({ _id }, updateFn)` |
| Delete | `db.things.deleteOne({ id })` | `db.things.deleteOne({ _id })` |
| Timestamps | `createdAt`, `updatedAt`, `deletedAt` | `createdAt`, `updatedAt`, `deletedAt` |

### Web pages

Place pages under `web/pages/app/` for authenticated routes:

```tsx
import Head from 'next/head';
import { LayoutType, Page, ScopeType } from 'components';
import { useApiQuery, useApiMutation, useQueryClient, queryKey } from 'hooks';
import { apiClient } from 'services/api-client.service';
```

IMPORTANT: Import `useQueryClient` from `hooks`, NOT from `@tanstack/react-query`.

Use `ScopeType.PRIVATE` + `LayoutType.MAIN` for authenticated pages.

### Import rules

- Use `@/` for all template imports: `@/db`, `@/procedures`, `@/config`
- Use `@/resources/base.schema` and `@/resources/users/users.schema` (not relative `../` paths)
- Relative imports within the same resource directory are fine

## Testing

Start infra in one terminal, plugins in another:

```bash
# Terminal 1
cd template && pnpm infra:postgres  # or pnpm infra:mongo

# Terminal 2 (from repo root)
pnpm plugin:dev plugins/postgres plugins/<name>
# or
pnpm plugin:dev plugins/mongo plugins/<name>
# combine with auth:
pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/<name>
```

## Steps to create a plugin

1. Create `plugins/<name>/plugin.json`
2. If it needs a database, create both `_postgres_api/` and `_mongo_api/` with DB-specific schemas and endpoints
3. Create shared web pages in `web/pages/app/<name>/`
4. Test with `pnpm plugin:dev plugins/<db> plugins/<name>`

## Reference

- `plugins/notes/` — minimal example with schema, 3 endpoints, and a page (both DB variants)
- `plugins/auth-starter/` — full-featured example with auth, multiple resources, server-config override, dual-DB
