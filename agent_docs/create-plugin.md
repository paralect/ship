Create a new Ship plugin. The user will describe what feature the plugin should provide.

## What is a plugin

A plugin is a directory under `plugins/` containing API resources (endpoints, schemas, methods) and/or web pages that get merged into the Ship template. See `PLUGINS.md` at the repo root for full documentation.

## Plugin structure

```
plugins/<name>/
  plugin.json                          # required
  api/
    resources/<name>/
      <name>.schema.ts                 # Drizzle pgTable — auto-registered in db.ts
      endpoints/*.ts                   # oRPC endpoints — auto-registered in router.ts
      methods/*.ts                     # business logic
      handlers/*.ts                    # event handlers — auto-imported
    server-config.ts                   # optional — overrides template server hooks
  web/
    pages/
      app/<name>/index.page.tsx        # pages under /app (authenticated)
```

## plugin.json

```json
{
  "name": "<plugin-name>",
  "version": "1.0.0",
  "description": "<what it does>"
}
```

Add `dependencies.api` and/or `dependencies.web` if the plugin needs extra npm packages.

## Key conventions

### API endpoints

Each file in `endpoints/` exports a default oRPC procedure:

```typescript
import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({ /* ... */ });
const outputSchema = z.object({ /* ... */ });

export default isAuthorized
  .input(inputSchema)
  .output(outputSchema)
  .handler(async ({ context, input }) => {
    // context.user is the authenticated user
    // db.<tableName> has find, findFirst, insertOne, updateOne, deleteOne, etc.
  });
```

Procedure builders: `isPublic` (no auth), `isAuthorized` (logged in), `isAdmin` (admin only).

### DB schemas

Export a `pgTable` call. Use `baseColumns` for id/timestamps and `@/` imports for template resources:

```typescript
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

The codegen auto-creates `db.things` with a `DbService` instance. Available methods: `find`, `findFirst`, `findPage`, `count`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`.

### Web pages

Place pages under `web/pages/app/` for authenticated routes:

```tsx
import Head from 'next/head';
import { LayoutType, Page, ScopeType } from 'components';
import { useApiQuery, useApiMutation, useQueryClient, queryKey } from 'hooks';
import { apiClient } from 'services/api-client.service';
```

IMPORTANT: Import `useQueryClient` from `hooks`, NOT from `@tanstack/react-query`.

Use `ScopeType.PRIVATE` + `LayoutType.MAIN` for authenticated pages. Use `ScopeType.PUBLIC` for public pages.

### Import rules

- Use `@/` for all template imports: `@/db`, `@/procedures`, `@/config`, `@/resources/base.schema`
- Use `@/resources/users/users.schema` (not `../users/users.schema`) when referencing template schemas
- Relative imports within the same resource directory are fine

## Testing

```bash
pnpm plugin:dev plugins/<name>
# or combine with other plugins:
pnpm plugin:dev plugins/auth-starter plugins/<name>
```

## Steps to create a plugin

1. Create `plugins/<name>/plugin.json`
2. Create the DB schema if needed (`api/resources/<name>/<name>.schema.ts`)
3. Create endpoints (`api/resources/<name>/endpoints/*.ts`)
4. Create web pages (`web/pages/app/<name>/index.page.tsx`)
5. Test with `pnpm plugin:dev plugins/<name>`

## Reference

Look at `plugins/notes/` as a minimal working example with schema, 3 endpoints, and a page.
Look at `plugins/auth-starter/` for a full-featured example with auth, multiple resources, and server-config override.
