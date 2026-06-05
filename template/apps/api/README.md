# API Component

A [Hono](https://hono.dev/) + [oRPC](https://orpc.unnoq.com/) API starter, designed to
handle routine tasks so you can focus on your product's business logic.

The filesystem is the wiring: every resource owns its endpoints, schemas, jobs, crons
and methods under `src/resources/<name>/`, and codegen turns the directory tree into a
typed router. There's one obvious place for each thing.

For more detailed information, refer to the
[API section in Ship documentation](https://ship.paralect.com/docs/api-reference/overview).

## Getting Started

### Prerequisites

Ensure you have a `.env` file. If not, create one by copying the `.env.example` file:

```sh
cp .env.example .env
```

### Running the Application

You can start the application in two ways:

1. **Independent Start**: From the `apps/api` folder, run:
   ```sh
   pnpm run dev
   ```
2. **Root Start**: From the root of the project, run:
   ```sh
   pnpm start
   ```
   This also starts the [developer dashboards](#developer-dashboards) (DB studio + API docs).

The API listens on `http://localhost:3001`.

## Endpoints

Endpoints live in `src/resources/<name>/endpoints/*.ts` and are **mounted by file path** —
`list.ts` → `GET`, `create.ts` → `POST`, `[id]/update.ts` → `PUT /{id}`. No route registry
to maintain. Each endpoint builds on the shared `@/endpoint` builder (the oRPC builder with
all global middlewares already applied) and declares its input, output and handler:

```ts
import db from '@/db';
import endpoint from '@/endpoint';
import isAdmin from '@/middlewares/is-admin';
import { listResultSchema, paginationSchema } from '@/resources/base.schema';
import { publicSchema } from '../users.schema';

export default endpoint
  .use(isAdmin)
  .input(paginationSchema)
  .output(listResultSchema(publicSchema))
  .handler(async ({ input }) => {
    return db.users.findPage({ where: { deletedAt: null }, ...input });
  });
```

`.input()` / `.output()` Zod schemas are the single source of truth — for the runtime *and*
for the types the web client sees. Gates compose with `.use(...)`: `isAuthorized`
(signed-in `context.user`), `isAdmin`, `canAccess(key, load)` (loads an entity into
`context[key]` or throws `NOT_FOUND`), and `canEdit(key, service)` (ownership gate built on
`canAccess`). Per-resource ownership middlewares live in `<resource>/middlewares/can-edit-*.ts`.

## Features

### Codegen

The router, contract and DB service are generated from the filesystem — never hand-edited:

- `scripts/codegen-router.ts` → `src/router.ts` + `src/contract.ts` (run after adding or
  removing endpoint files).
- `scripts/codegen-db.ts` → `src/db.ts` (a typed `DbService` per table, run after schema files change).

Run both with `pnpm codegen`. `pnpm build:types` emits `.d.ts` so the web app can consume the
API types via `import type { AppClient } from 'api'` — no shared types package, no drift.

### Data Handling

- **Database**: [Drizzle ORM](https://orm.drizzle.team/) over [PostgreSQL](https://www.postgresql.org/).
  Data access is the generated `@/db` service — `find` / `findFirst` / `findPage` / `count` /
  `insertOne` / `insertMany` / `updateOne` / `updateMany` / `deleteOne` / `deleteMany`, plus
  `db.transaction(...)` and relation loading via `with` / `columns`. Every table extends
  `baseColumns` (a `uuid` id, `createdAt`, `updatedAt` and a `deletedAt` soft-delete column).
- **Mutation events**: every write emits a typed `MutationEvent` (`{ type, docs, prevDocs }`).
  Drop a handler in `<resource>/handlers/*.ts` to react — sync analytics, push over a socket,
  denormalise — without coupling it to the endpoint.
- **Request Validation**: request data validation and sanitization with [Zod](https://zod.dev/).

### Migrations

Drizzle owns the schema lifecycle:

```sh
pnpm generate    # drizzle-kit emits SQL into apps/api/drizzle/ from the schema diff
pnpm migrate     # apply pending migrations (scripts/migrate.ts)
pnpm db:push     # push the schema directly (dev only)
```

### Authentication

[better-auth](https://better-auth.com/) resolves the session on every request and attaches
the user row to `context.user` when signed in. The full auth surface — email/password,
verification, reset, Google OAuth, plus the web pages and the oRPC client — is delivered by
the **Auth plugin** (`plugins/auth-starter`), which merges into your codebase.

### Communication and Scheduling

- **WebSocket**: integrated [Socket.IO](https://socket.io/) server (Redis adapter for
  multi-instance fan-out).
- **Scheduler**: a cron job is one file that default-exports `scheduler({ cron, handler })`:
  ```ts
  import scheduler from '@/scheduler';

  export default scheduler({
    cron: '0 * * * *',
    handler: async () => {
      /* ... */
    },
  });
  ```
  Cron files live in `<resource>/crons/*.ts` and are auto-discovered like endpoints, so plugins
  add crons by dropping a file. Run with `pnpm schedule` (or `pnpm schedule-dev` in watch mode).

### Configuration and Management

- **Config Management**: configuration management with schema validation.
- **Logging**: configured console logger for effective debugging.
- **Environment Handling**: supports development and production environments with Docker configuration.

### Development Tools

- **Automatic Restart**: [tsx](https://tsx.is/) restarts the app on code changes.
- **Code Quality**: linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://prettier.io/).
- **TypeScript Support**: full TypeScript support for a better development experience.

### Developer Dashboards

Two interactive dashboards are available during development (both auto-started by `pnpm start`):

- **API Documentation** — interactive OpenAPI reference with "try it out" (Scalar).
  - URL: <http://localhost:3001/docs>
  - Raw spec: <http://localhost:3001/spec.json> (OpenAPI 3.1, generated live from the oRPC router)
  - Served in-process by the API; non-production only.
- **Database Studio** — visual table/relations browser + query runner (Drizzle Studio).
  - URL: <https://local.drizzle.studio>
  - Standalone: `pnpm dashboard` (alias for `pnpm --filter api studio`)
