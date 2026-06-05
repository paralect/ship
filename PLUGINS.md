# Ship Plugins

Plugins add features to the Ship template without modifying it. Each plugin is a directory (or git repo) of API resources, web routes and packages that **merge into your codebase** — `apps/api/src/resources/...`, `apps/web/src/routes/...`, `packages/...`. Install copies the files in; from then on they're yours to edit, extend or delete. Like shadcn/ui, but for your entire stack.

## Available Plugins

| Plugin | Description | Requires |
|--------|-------------|----------|
| `plugins/postgres` | Drizzle ORM + PostgreSQL — `@ship/db` package with `DbService` (relation loading via `with` / `columns`), `codegen-db`, base schema, and migrations | — |
| `plugins/auth-starter` | **Auth.** better-auth wiring (email/password + verification + reset + Google OAuth) plus the web pages (sign-in/up, forgot/reset, the authenticated app shell) and the oRPC client | `postgres`, `mailer`, `cloud-storage` |
| `plugins/admin` | Admin dashboard with a paginated user list. Web routes under `apps/web/src/routes` | `postgres`, `auth-starter` |
| `plugins/notes` | Simple notes CRUD — the minimal example plugin (API endpoints + web UI) | `postgres` |
| `plugins/ai-chat` | Streaming AI chat via the `@ship/ai` package — conversations, messages, AI responses | `postgres`, `auth-starter` |
| `plugins/mailer` | Resend + React Email — provides the `@ship/emails` package | — |
| `plugins/cloud-storage` | S3-compatible storage (local Garage dev server) — provides the `@ship/cloud-storage` package | — |

> **Auth is plugin-delivered.** In 3.0.0 the base `apps/web` is a landing page with server functions; the `auth-starter` plugin provides both the API auth wiring and the authenticated web app shell. There is no auth in the template until you add the plugin.

> **MongoDB.** A `plugins/mongo` implementation (`@paralect/node-mongo`) is kept in the repo but is **not offered by the CLI**. PostgreSQL is the default and only database the scaffold installs.

## Plugin Structure

```
my-plugin/
  plugin.json                        # required
  api/
    src/
      resources/
        things/
          things.schema.ts           # Drizzle pgTable + Zod schemas
          endpoints/*.ts             # oRPC endpoints, mounted by file path
          methods/*.ts               # business logic
          handlers/*.ts              # mutation-event handlers
          crons/*.ts                 # scheduled jobs — scheduler({ cron, handler })
          middlewares/*.ts           # per-resource gates (e.g. can-edit-*.ts)
      server-config.ts               # optional — overrides template server hooks
    scripts/                         # optional — codegen scripts
  web/
    routes/
      _authenticated/app/things/     # → apps/web/src/routes/_authenticated/app/things/
        index.tsx                    # a TanStack Router route
        -components/                 # private, ignored by the router
```

> The plugin merger flattens `plugin/web/X/...` → `apps/web/src/X/...`. Do not add an extra `src/` step in the plugin layout. Web routes are TanStack Router files under `web/routes/...`.

### Database packages

The `postgres` plugin ships the `@ship/db` package and the database resources. A plugin that needs tables drops a `things.schema.ts` (a Drizzle `pgTable` plus Zod schemas) next to its endpoints; `codegen-db.ts` regenerates the typed `DbService` from it.

```
my-plugin/
  plugin.json
  api/
    src/resources/things/
      things.schema.ts               # pgTable export — picked up by codegen-db
      endpoints/*.ts
  web/routes/...                     # the UI
```

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

- **API endpoints** in `resources/*/endpoints/*.ts` are mounted by file path (`list.ts` → `GET`, `create.ts` → `POST`, `[id]/update.ts` → `PUT /{id}`) and wired into `router.ts` + `contract.ts` by `codegen-router.ts`. They build on the shared `@/endpoint` base (the oRPC builder with all `@/middlewares/global` applied) and compose gates with `.use(...)`: `isAuthorized`, `isAdmin`, `canAccess(key, load)` (loads an entity into `context[key]` or throws `NOT_FOUND`), and `canEdit(key, service)` (ownership, also `NOT_FOUND` on mismatch — no existence leak). Per-resource ownership rules live in `<resource>/middlewares/can-edit-*.ts`.
- **PostgreSQL schemas** — a `pgTable()` export in `resources/*/<name>.schema.ts` is picked up by `codegen-db.ts` and registered with `@ship/db`.
- **Web routes** are TanStack Router files under `web/routes/...`, merged into `apps/web/src/routes/...`. Files and folders prefixed `-` (e.g. `-components/`) are private and ignored by the router.
- **Crons** — a file in `resources/*/crons/*.ts` that default-exports `scheduler({ cron, handler })` is run by the scheduler. Drop a file to add a job.
- **server-config.ts** overrides the template's default (no-op) server hooks, e.g. auth resolution.

Plugin files are **merged** into the template — existing files are preserved.

## Dev Testing

Start infrastructure in one terminal, run plugins in another:

```bash
# Terminal 1 — infrastructure
cd template
pnpm infra:postgres

# Terminal 2 — run plugins (from repo root)
pnpm plugin:dev plugins/postgres plugins/auth-starter plugins/notes
```

This:
1. Copies the template into `plugin-dev-server/` (gitignored)
2. Merges plugin files
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
2. If it needs tables, add a `things.schema.ts` (Drizzle `pgTable` + Zod) next to your endpoints
3. Add web routes in `web/routes/...`
4. Test: `pnpm plugin:dev plugins/postgres plugins/<name>`

See `plugins/notes/` as a minimal working example.
