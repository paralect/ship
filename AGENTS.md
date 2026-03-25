# Ship

Monorepo template with API (Hono + oRPC) and web (Next.js 15) apps.

## Agent Docs

- `agent_docs/create-plugin.md` — How to create a plugin (read before building plugins)
- `PLUGINS.md` — Plugin system overview for humans

## Key Files

- `template/apps/api/scripts/codegen-router.ts` — Auto-generates router.ts from resources
- `template/apps/api/scripts/codegen-db.ts` — Auto-generates db.ts from schemas
- `template/scripts/plugin.ts` — Plugin CLI (install, uninstall, list, dev)

## Project Layout

- `template/` — The Ship template (API + web monorepo)
- `plugins/` — Plugin directories (auth-starter, notes, etc.)
- `template/plugin-dev-server/` — Gitignored directory where plugins are tested
