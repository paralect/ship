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
