# Workflows: Dev / Build / Test

> Read this for any task that involves running, building, or validating code.

---

## Prerequisites

- **Node ≥22.13.0** (see `.nvmrc`). Use `nvm use` if needed.
- **pnpm ≥9.5.0** (`corepack enable && corepack prepare pnpm@9.5.0 --activate`).
- **Docker** for local Postgres + Redis.

---

## Install

```bash
pnpm install
```

---

## Infrastructure (Local)

```bash
pnpm infra              # Redis only
pnpm infra:postgres     # Redis + Postgres (default DB plugin)
pnpm infra:mongo        # Redis + MongoDB (alternate DB plugin)
```

---

## Dev Mode

```bash
pnpm start          # everything (infra → migrate → schedule → api + web)
pnpm turbo-start    # Turborepo (assumes infra running)
```

Individual:

```bash
pnpm --filter api dev       # API on :3001
pnpm --filter web dev       # Web on :3002
```

---

## Dashboards

When you run `pnpm start` (or `pnpm turbo-start`), these dashboards come up alongside the app:

### API docs (OpenAPI / Scalar)

- **URL:** <http://localhost:3001/docs>
- **Raw spec:** <http://localhost:3001/spec.json> (OpenAPI 3.1.1, generated live from the oRPC router)
- **Details:** Interactive reference with "try it out" — served in-process by the Hono API on `:3001`. Disabled in production (`APP_ENV=production`).

### Database studio (Drizzle)

- **Standalone:** `pnpm dashboard` (alias for `pnpm --filter api studio`)
- **URL:** <https://local.drizzle.studio> (proxy on `:4983`)
- **Details:** Visual table/relation browser + query runner. Requires the Postgres plugin (`drizzle.config.ts`); no-op on Mongo / web-only.

---

## Build

```bash
pnpm turbo build
pnpm --filter api build:types    # declarations only (for web type consumption)
```

---

## Typecheck

```bash
pnpm --filter api tsc --noEmit    # API
pnpm --filter web tsc --noEmit    # Web
```

---

## Codegen

`scripts/codegen-router.ts` and `scripts/codegen-db.ts` run automatically in `pnpm --filter api dev` (watch mode). To regenerate ad-hoc:

```bash
pnpm --filter api codegen     # runs both, then eslint --fix + prettier
```

---

## Drizzle Migrations

```bash
pnpm --filter api generate    # diff schemas → new migration in apps/api/drizzle/
pnpm --filter api migrate     # apply pending migrations to the configured DB
pnpm --filter api db:push     # push schema to DB without writing migration files (dev only)
```

---

## When to Run What

| I changed... | Run |
|---|---|
| Any `package.json` | `pnpm install` |
| API endpoint added/removed | `pnpm --filter api codegen` then `build:types` |
| API schema added/removed | `pnpm --filter api codegen` then `pnpm --filter api generate` (commit the migration) |
| API endpoint input/output schema | `pnpm --filter api build:types` then typecheck web |
| API code (any) | `pnpm --filter api tsc --noEmit` |
| Web code (any) | `pnpm --filter web tsc --noEmit` |
| `app-constants` | Typecheck any package that imports it |
| Before committing | Typecheck both API and web |
