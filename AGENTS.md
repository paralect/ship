# Ship

AI-native, batteries-included full-stack TypeScript SaaS starter: standardised patterns and one obvious way to build, so you and your agents work without guesswork.

Monorepo template with API (Hono + oRPC + Drizzle + better-auth) and web (Vite + TanStack Start SPA + TanStack Router + shadcn + Tailwind v4) apps, plus a plugin system that merges feature add-ons into the template.

The CLI scaffolds the template in one of two shapes:

- **PostgreSQL full-stack** — `apps/api` (Hono + oRPC + Drizzle) + `apps/web` (TanStack Start), end-to-end types from API → web.
- **Web-only** — `apps/web` only (TanStack Start landing + server functions); no `apps/api`, backend logic lives in `createServerFn` handlers.

## Agent Docs

- `agent_docs/create-plugin.md` — How to create a plugin (read before building plugins)
- `PLUGINS.md` — Plugin system overview + canonical plugin catalog

## Template Agent Docs (read these first when working inside the template)

- `template/agent_docs/api_resource_and_endpoint_workflow.md` — Resource/endpoint convention, endpoint entry point + global middleware registry + per-resource ownership gates, transactions, event hooks
- `template/agent_docs/web_pages_and_data_access.md` — File routes, oRPC client, useApiQuery/Mutation/Form, AppDrawer + Table widgets
- `template/agent_docs/workflows_dev_build_test.md` — Commands for dev/build/codegen/migrate
- `template/agent_docs/common_failure_modes.md` — Known pitfalls and fixes

## Key Files

- `template/apps/api/scripts/codegen-router.ts` — Auto-generates `src/router.ts` + `src/contract.ts` from `resources/*/endpoints/*.ts`
- `template/apps/api/scripts/codegen-db.ts` — Auto-generates `src/db.ts` with typed `DbService<typeof t, typeof rawDb.query.t>` (relations generic) wrappers + `transaction()` + event-bus hooks
- `template/scripts/plugin.ts` — Plugin CLI (`install`, `uninstall`, `list`, `dev`)
- `template/apps/web/vite.config.ts` — TanStack Start plugin (`tanstackStart({ spa: { … } })`)
- `template/apps/web/src/routes/__root.tsx` — Root route with `head`, `shellComponent`, providers
- `template/apps/web/src/services/api-client.service.ts` — oRPC client (stable-identity proxy + `ORPC_PATH` symbol for query keys)
- `template/apps/web/src/hooks/use-api.hook.ts` — `useApiQuery`, `useApiMutation`, `useApiForm`
- `template/packages/db/src/service.ts` — `DbService<T>` with mutation event hooks

## Project Layout

- `template/` — The Ship template (API + web monorepo). What `create-ship-app` scaffolds.
- `plugins/` — Plugin directories: `postgres`, `auth-starter`, `admin`, `notes`, `ai-chat`, `mailer`, `cloud-storage`.
- `template/plugin-dev-server/` — Gitignored merge target for `pnpm plugin:dev`.
- `packages/create-ship-app/` — The CLI that bootstraps a new project from the template.
