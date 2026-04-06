# AGENTS.md — Ship Monorepo

> pnpm monorepo (Turborepo): `apps/api` (Koa + MongoDB), `apps/web` (Next.js Pages Router), `packages/shared` (auto-generated typed API client), plus `app-constants`, `mailer`, config packages.

---

## Before You Code

1. **Read this file** for universal rules and commands.
2. **Read the scoped file** nearest to your task:
   - API work → `apps/api/AGENTS.md`
   - Web work → `apps/web/AGENTS.md`
   - Codegen / shared types → `packages/shared/AGENTS.md`
3. **Read the relevant workflow doc** from the index below.
4. **Scan existing code** — search for a similar resource/page/endpoint before creating new patterns.
5. **Plan, implement, verify** — every task ends with a verification command.

---

## Progressive Disclosure Index

| Doc | When to read |
|-----|-------------|
| `agent_docs/workflows_dev_build_test.md` | Any task: install, dev, build, typecheck, lint, test |
| `agent_docs/api_resource_and_endpoint_workflow.md` | Adding/modifying API resources or endpoints |
| `agent_docs/web_pages_and_data_access.md` | Adding/modifying web pages or API data consumption |
| `agent_docs/shared_codegen_contract.md` | After any API endpoint/schema change; understanding the type bridge |
| `agent_docs/common_failure_modes.md` | When debugging errors or before submitting changes |
| `apps/api/AGENTS.md` | API-specific invariants (middleware, services, config) |
| `apps/web/AGENTS.md` | Web-specific invariants (routing, components, styling) |
| `packages/shared/AGENTS.md` | What's generated, what's hand-written, what not to touch |

---

## Universal Commands

```bash
# Install (always after pulling or changing deps)
pnpm install

# Start infra (MongoDB + Redis via Docker)
pnpm infra

# Start everything (infra → migrator → scheduler → api + web)
pnpm start

# Dev mode (with Turborepo — runs migrate, schedule, then dev for all apps)
pnpm turbo-start

# Build all
pnpm turbo build

# Typecheck (per-package)
pnpm --filter api tsc --noEmit
pnpm --filter web tsc --noEmit

# Lint (per-package)
pnpm --filter api eslint .
pnpm --filter web eslint .

# Regenerate shared typed client (REQUIRED after any API endpoint/schema change)
pnpm --filter shared generate
```

---

## Never Do

- **Use npm or yarn.** `engines` block rejects them. pnpm ≥9.5.0 only.
- **Use Node < 22.13.0.** See `.nvmrc`.
- **Hand-edit `packages/shared/src/generated/`** or `packages/shared/src/schemas/`. These are overwritten by codegen.
- **Forget to run codegen** after changing any `*.schema.ts` or `endpoints/*.ts` in the API.
- **Register routes manually.** Endpoint auto-discovery handles it — just put files in `resources/<name>/endpoints/`.
- **Create a web page without `.page.tsx` extension.** Next.js config only recognizes `*.page.tsx` and `*.api.ts`.
- **Skip the `<Page>` wrapper** in web pages. Every page needs `<Page scope={...} layout={...}>`.
- **Import from `src/...`** in API code. `tsconfig.baseUrl` is `src`, so use `'resources/...'`, `'routes/...'`, `'config'`, etc.
- **Use Zod 3 API.** This repo uses Zod 4 (e.g., `z.email()` not `z.string().email()`).
- **Add env vars without updating the Zod config schema** in `apps/api/src/config/` or `apps/web/src/config/`.

---

## Definition of Done

Every change must pass before submission:

- [ ] `pnpm --filter <affected-package> tsc --noEmit` — no type errors
- [ ] `pnpm --filter <affected-package> eslint .` — no lint errors
- [ ] If API endpoints/schemas changed → `pnpm --filter shared generate` ran and output committed
- [ ] If new env vars → added to `.env.example` AND the Zod config schema
- [ ] Spot-check: the feature works (dev server loads, endpoint responds, page renders)

---

## Self-Maintenance

Update **this file** when: monorepo structure changes, new packages added, universal commands change, or new "never do" items discovered.

Update **scoped files** (`apps/*/AGENTS.md`, `packages/shared/AGENTS.md`) when the invariants they document change.

Update **`agent_docs/*`** when workflows, checklists, or failure modes change. Each doc lists its own update triggers.
