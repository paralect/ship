# Ship Plugins

Plugins add features to the Ship template without modifying it. Each plugin is a directory (or git repo) containing API resources and/or web pages that get merged into the template at dev time or install time.

## Available Plugins

| Plugin | Description | Requires |
|--------|-------------|----------|
| `plugins/postgres` | Drizzle ORM + PostgreSQL — DbService, codegen-db, users/tokens schemas, base schema, migrations | — |
| `plugins/mongo` | MongoDB with @paralect/node-mongo — auto-discovery of schemas, services, and indexes | — |
| `plugins/auth-starter` | Authentication (sign-in/up, forgot/reset password, Google OAuth), user management, dashboard | postgres or mongodb |
| `plugins/notes` | Simple notes CRUD — example plugin | postgres or mongodb |
| `plugins/ai-chat` | AI chat with configurable LLM model via `@ship/ai` package | postgres, auth-starter |

## Plugin Structure

```
my-plugin/
  plugin.json                        # required
  api/
    src/
      resources/
        things/
          endpoints/*.ts             # oRPC endpoints (auto-registered in router.ts)
          methods/*.ts               # business logic
          handlers/*.ts              # event handlers (auto-imported)
      server-config.ts               # optional — overrides template server hooks
    scripts/                         # optional — codegen scripts
  web/
    pages/
      app/things/index.page.tsx      # Next.js pages (auto-discovered)
```

### Multi-DB plugins

Plugins that need a database provide separate implementations via `_postgres_api/` and `_mongo_api/`:

```
my-plugin/
  plugin.json
  _postgres_api/
    api/
      src/resources/things/          # Drizzle/PostgreSQL implementation
        things.schema.ts             # pgTable export — auto-registered in db.ts
        endpoints/*.ts
  _mongo_api/
    api/
      src/resources/things/          # MongoDB implementation
        things.schema.ts             # Zod schema — auto-discovered by init-db.ts
        endpoints/*.ts
  web/pages/...                      # Shared UI (same for both DBs)
```

The plugin system detects which DB plugin (`postgres` or `mongodb`) is in the list and merges the matching `_*_api/` directory.

### Monorepo packages

Plugins can include shared packages under `packages/`:

```
my-plugin/
  packages/
    my-lib/
      package.json              # { "name": "@ship/my-lib", ... }
      src/index.ts
```

During `plugin:dev`, these are copied into `plugin-dev-server/packages/` and become available as workspace dependencies. Reference them in `plugin.json` dependencies:

```json
{
  "dependencies": {
    "api": { "@ship/my-lib": "workspace:*" }
  }
}
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin does",
  "requires": ["postgres"],
  "dependencies": {
    "api": { "some-package": "^1.0.0" },
    "web": { "some-ui-lib": "^2.0.0" }
  }
}
```

## How It Works

- **API endpoints** in `resources/*/endpoints/*.ts` are auto-discovered by `codegen-router.ts`
- **PostgreSQL schemas** with `pgTable()` exports are auto-discovered by `codegen-db.ts` (postgres plugin)
- **MongoDB schemas** are auto-discovered by `init-db.ts` at startup (mongodb plugin)
- **Web pages** matching `*.page.tsx` are auto-discovered by Next.js
- **server-config.ts** overrides the template's default (no-op) server hooks for auth resolution

Plugin files are **merged** into the template — existing files are preserved.

## Dev Testing

Start infrastructure in one terminal, run plugins in another:

```bash
# Terminal 1 — infrastructure
cd template
pnpm infra:postgres   # or pnpm infra:mongo

# Terminal 2 — run plugins (from repo root)
pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/notes
# or
pnpm plugin:dev plugins/mongo plugins/auth-starter plugins/notes
```

This:
1. Copies the template into `plugin-dev-server/` (gitignored)
2. Merges plugin files + DB-specific variant
3. Installs plugin dependencies
4. Runs codegen and `db:push`
5. Starts the dev server
6. Watches plugin files for changes and re-merges automatically

## Install (permanent)

Copy plugin files into the template permanently (like shadcn/ui):

```bash
pnpm plugin:install <git-url>
pnpm plugin:uninstall <name>
pnpm plugin:list
```

After install, the files are yours to edit.

## Creating a New Plugin

1. Create `plugins/<name>/plugin.json`
2. If it needs a database, create `_postgres_api/` and/or `_mongo_api/` with DB-specific code
3. Add shared web pages in `web/pages/`
4. Test: `pnpm plugin:dev plugins/<db> plugins/<name>`

See `plugins/notes/` as a minimal working example.
