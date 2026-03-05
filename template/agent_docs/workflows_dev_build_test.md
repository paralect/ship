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

Run after pulling, after changing any `package.json`, or after modifying `pnpm-workspace.yaml` catalog.

---

## Infrastructure (Local)

```bash
pnpm infra          # starts MongoDB (27017) + Redis (6379) via Docker
```

MongoDB runs as a replica set (`rs`) — required for change streams and transactions.

---

## Dev Mode

```bash
# Everything at once (infra → migrate → schedule → api + web dev):
pnpm start

# Or with Turborepo (assumes infra already running):
pnpm turbo-start
```

Individual apps:

```bash
pnpm --filter api dev       # API on :3001 (tsx watch)
pnpm --filter web dev       # Web on :3002 (next dev)
```

Turbo pipeline order: `api#migrate-dev` → `api#schedule-dev` → `dev` (all apps).

---

## Build

```bash
pnpm turbo build            # builds all packages + apps
pnpm --filter api build     # API only (tsc)
pnpm --filter web build     # Web only (next build)
```

---

## Typecheck

```bash
pnpm --filter api tsc --noEmit
pnpm --filter web tsc --noEmit
pnpm --filter shared tsc --noEmit
```

No project-wide `tsc` — run per-package. These are the verification commands to run after changes.

---

## Lint

```bash
pnpm --filter api eslint .
pnpm --filter web eslint .
```

Uses `@antfu/eslint-config` (flat config, ESLint 9). Key enforced rules:
- `no-explicit-any` is an **error** (not warning)
- Import ordering is enforced (don't hand-sort — let eslint fix)
- No relative imports beyond 1 level deep in API (`no-relative-import-paths` plugin)

Run `eslint . --fix` to auto-fix. Don't fight the linter — if it's enforced, comply.

---

## Codegen

```bash
pnpm --filter shared generate          # one-shot
pnpm --filter shared generate:watch    # watches API resources for changes
```

Must run after any change to `apps/api/src/resources/*/endpoints/*.ts` or `*.schema.ts`.
See `agent_docs/shared_codegen_contract.md` for details.

---

## When to Run What

| I changed... | Run |
|---|---|
| Any `package.json` or catalog | `pnpm install` |
| API endpoint or schema file | `pnpm --filter shared generate`, then typecheck |
| API code (any) | `pnpm --filter api tsc --noEmit` |
| Web code (any) | `pnpm --filter web tsc --noEmit` |
| Shared package code | `pnpm --filter shared tsc --noEmit`, then typecheck consumers |
| `app-constants` | Typecheck any package that imports it |
| Before committing | `pnpm --filter api tsc --noEmit && pnpm --filter web tsc --noEmit` |

---

## Turborepo Filter Patterns

```bash
pnpm --filter api <script>        # apps/api
pnpm --filter web <script>        # apps/web
pnpm --filter shared <script>     # packages/shared
pnpm --filter app-constants <script>
```

Package names match their `package.json` `name` field. Check with `pnpm ls --depth -1` if unsure.

---

## Update Triggers

Update this doc when:
- Root or app-level `package.json` scripts change
- `turbo.json` pipeline tasks change
- Node/pnpm version requirements change
- New packages are added to the workspace
