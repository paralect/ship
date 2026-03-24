# AGENTS.md — Ship Monorepo

> pnpm monorepo (Turborepo): `apps/api` (Hono + oRPC + MongoDB), `apps/web` (Next.js Pages Router), plus `app-constants`, `mailer`, config packages. Types flow from API → web via TypeScript declarations (`tsc --emitDeclarationOnly`), no codegen.

---

## Before You Code

1. **Read this file** for universal rules and commands.
2. **Read the scoped file** nearest to your task:
   - API work → `apps/api/AGENTS.md`
   - Web work → `apps/web/AGENTS.md`
3. **Read the relevant workflow doc** from the index below.
4. **Scan existing code** — search for a similar resource/page/procedure before creating new patterns.
5. **Plan, implement, verify** — every task ends with a verification command.

---

## Progressive Disclosure Index

| Doc | When to read |
|-----|-------------|
| `agent_docs/workflows_dev_build_test.md` | Any task: install, dev, build, typecheck, lint |
| `agent_docs/api_resource_and_endpoint_workflow.md` | Adding/modifying API resources or endpoints |
| `agent_docs/web_pages_and_data_access.md` | Adding/modifying web pages or API data consumption |
| `agent_docs/common_failure_modes.md` | When debugging errors or before submitting changes |
| `apps/api/AGENTS.md` | API-specific invariants (middleware, services, config) |
| `apps/web/AGENTS.md` | Web-specific invariants (routing, components, styling) |

---

## Universal Commands

```bash
pnpm install                        # after pulling or changing deps
pnpm infra                          # start MongoDB + Redis via Docker
pnpm start                          # start everything (infra → migrator → scheduler → api + web)
pnpm turbo-start                    # dev mode via Turborepo (assumes infra running)

pnpm --filter api tsc --noEmit      # typecheck API
pnpm --filter web tsc --noEmit      # typecheck web
pnpm --filter api build:types       # rebuild API declarations (REQUIRED after procedure/schema changes)
```

---

## Never Do

- Use npm or yarn. pnpm ≥9.5.0 only.
- Use Node < 22.13.0. See `.nvmrc`.
- Create a web page without `.page.tsx` extension.
- Skip the `<Page>` wrapper in web pages.
- Use `src/...` prefix in API imports — `tsconfig.baseUrl` is `src`.
- Add env vars without updating the Zod config schema.
- Use deep relative imports in API procedure files that cross into non-relative modules.
- Forget to update barrels after adding a new endpoint file — add the export to `endpoints/index.ts`. For new resources, also add to `src/router.ts`.

---

## Type Flow: API → Web

1. API endpoints define `.input(zodSchema).output(zodSchema).handler(...)`.
2. `pnpm --filter api build:types` builds `.d.ts` files to `apps/api/dist/`.
3. Web imports types via `"api": "workspace:*"` dependency — `import type { AppClient } from 'api'`.
4. No codegen, no shared package. Types flow through TypeScript declarations.

---

## Definition of Done

- [ ] `pnpm --filter <affected-package> tsc --noEmit` — no type errors
- [ ] `pnpm --filter <affected-package> eslint .` — no lint errors
- [ ] If API endpoints/schemas changed → `pnpm --filter api build:types` ran
- [ ] If new env vars → added to `.env.example` AND the Zod config schema
