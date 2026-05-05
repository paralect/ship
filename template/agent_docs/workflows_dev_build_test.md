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
pnpm infra          # starts Postgres + Redis via Docker
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

```bash
cd apps/api && npx tsx scripts/codegen-router.ts   # after endpoint file changes
cd apps/api && npx tsx scripts/codegen-db.ts       # after schema file changes
```

---

## When to Run What

| I changed... | Run |
|---|---|
| Any `package.json` | `pnpm install` |
| API endpoint file added/removed | `npx tsx scripts/codegen-router.ts` then `build:types` |
| API schema file added/removed | `npx tsx scripts/codegen-db.ts` then `build:types` |
| API endpoint input/output schema | `pnpm --filter api build:types` then typecheck web |
| API code (any) | `pnpm --filter api tsc --noEmit` |
| Web code (any) | `pnpm --filter web tsc --noEmit` |
| `app-constants` | Typecheck any package that imports it |
| Before committing | Typecheck both API and web |
