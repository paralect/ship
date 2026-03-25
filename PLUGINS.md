# Ship Plugins

Plugins add features to the Ship template without modifying it. Each plugin is a directory (or git repo) containing API resources and/or web pages that get merged into the template at dev time or install time.

## Available Plugins

| Plugin | Description | Requires |
|--------|-------------|----------|
| `plugins/postgres` | Drizzle ORM + PostgreSQL — db.service, codegen-db, users schema, base schema | — |
| `plugins/auth-starter` | Authentication, user management, dashboard | postgres |
| `plugins/notes` | Simple notes CRUD — example plugin | postgres |

## Plugin Structure

```
my-plugin/
  plugin.json                    # required — metadata
  api/
    resources/
      things/
        things.schema.ts         # Drizzle schema (auto-registered in db.ts)
        endpoints/
          list.ts                # oRPC endpoints (auto-registered in router.ts)
          create.ts
        methods/
          do-something.ts        # Business logic
        handlers/
          on-create.ts           # Event handlers (auto-imported)
    server-config.ts             # Optional — overrides template's server-config.ts
  web/
    pages/
      app/
        things/
          index.page.tsx         # Next.js pages (auto-discovered)
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin does",
  "dependencies": {
    "api": { "some-package": "^1.0.0" },
    "web": { "some-ui-lib": "^2.0.0" }
  }
}
```

## How It Works

- **API endpoints** in `resources/*/endpoints/*.ts` are auto-discovered by `codegen-router.ts`
- **DB schemas** with `pgTable()` exports in `resources/*/*.schema.ts` are auto-discovered by `codegen-db.ts`
- **Web pages** matching `*.page.tsx` are auto-discovered by Next.js
- **server-config.ts** at `api/` root overrides the template's default (no-op) server hooks

Plugin files are **merged** into the template — existing template files (like `users.schema.ts`) are preserved.

## Writing Plugin Code

### API Endpoints

Use the same patterns as the template:

```typescript
// api/resources/things/endpoints/create.ts
import db from '@/db';
import { isAuthorized } from '@/procedures';
import { z } from 'zod';

const inputSchema = z.object({ name: z.string().min(1) });

export default isAuthorized.input(inputSchema).handler(async ({ context, input }) => {
  return db.things.insertOne({ name: input.name, userId: context.user.id });
});
```

Available procedure builders: `isPublic`, `isAuthorized`, `isAdmin`.

### DB Schemas

```typescript
// api/resources/things/things.schema.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/resources/base.schema';
import { users } from '@/resources/users/users.schema';

export const things = pgTable('things', {
  ...baseColumns,
  name: text('name').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
});
```

The table gets a `DbService` instance automatically at `db.things` with `find`, `findFirst`, `findPage`, `insertOne`, `updateOne`, `deleteOne`, etc.

### Web Pages

```typescript
// web/pages/app/things/index.page.tsx
import { LayoutType, Page, ScopeType } from 'components';
import { useApiQuery, useApiMutation, useQueryClient, queryKey } from 'hooks';
import { apiClient } from 'services/api-client.service';
```

**Important:** Import `useQueryClient` from `hooks`, not from `@tanstack/react-query` directly.

### Imports

- Use `@/` for template utilities: `@/db`, `@/procedures`, `@/config`, `@/resources/...`
- Use `@/resources/base.schema` and `@/resources/users/users.schema` (not relative `../` paths) when referencing template resources from a plugin

## Dev Testing

Run one or more plugins from the repo root:

```bash
pnpm plugin:dev plugins/auth-starter
pnpm plugin:dev plugins/auth-starter plugins/notes
```

This:
1. Copies the template into `plugin-dev-server/` (gitignored)
2. Merges plugin files in
3. Runs codegen (router + db) and `db:push`
4. Starts the dev server
5. Watches plugin files for changes and re-merges automatically

## Install (permanent)

Copy plugin files into the template permanently (like shadcn/ui):

```bash
pnpm plugin:install <git-url>
pnpm plugin:uninstall <name>
pnpm plugin:list
```

After install, the files are yours to edit.

## Creating a New Plugin

1. Create a directory under `plugins/` (or a separate git repo)
2. Add `plugin.json` with at least `name`
3. Add resources under `api/resources/` and/or pages under `web/pages/`
4. Test with `pnpm plugin:dev plugins/your-plugin`
5. Verify endpoints, pages, and DB tables work
