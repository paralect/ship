# Workflows: Dev / Build / Test

> Read this for any task that involves running, building, or validating code.

---

## Prerequisites

- **Node ≥22.13.0** (see `.nvmrc`). Use `nvm use` if needed.
- **pnpm ≥9.5.0** (`corepack enable && corepack prepare pnpm@9.5.0 --activate`).
- **Docker** for local MongoDB + Redis.

---

## Install

```bash
pnpm install
```

---

## Infrastructure (Local)

```bash
pnpm infra          # starts MongoDB (27017) + Redis (6379) via Docker
```

MongoDB runs as a replica set — required for change streams and transactions.

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
pnpm --filter api tsc --noEmit
pnpm --filter web tsc --noEmit
```

---

## When to Run What

| I changed... | Run |
|---|---|
| Any `package.json` | `pnpm install` |
| API procedure or schema | `pnpm --filter api build:types`, then typecheck web |
| API code (any) | `pnpm --filter api tsc --noEmit` |
| Web code (any) | `pnpm --filter web tsc --noEmit` |
| `app-constants` | Typecheck any package that imports it |
| Before committing | `pnpm --filter api tsc --noEmit && pnpm --filter web tsc --noEmit` |
