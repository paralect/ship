# Changelog

## 3.0.0

Major release — Ship rebuilt on a modern, AI-native TypeScript stack.

### Breaking changes

- **Renamed to `@paralect/ship`.** `npx @paralect/ship init` is the primary command. `npx create-ship-app@latest init` continues to work — the CLI is published under both names.
- **Two scaffold setups instead of three:** `PostgreSQL + TanStack Start` (full-stack) or `TanStack Start web-only`. MongoDB is no longer offered (the `plugins/mongo` and `@paralect/node-mongo` code remains in the repo but is not scaffolded).
- **Web** is now [TanStack Start](https://tanstack.com/start) (SPA) + TanStack Router, replacing Next.js.
- **API** is [Hono](https://hono.dev/) + [oRPC](https://orpc.unnoq.com/) + [Drizzle](https://orm.drizzle.team/) + [better-auth](https://better-auth.com/), replacing Koa + `@paralect/node-mongo`.

### Added

- **Web-only** scaffolds ship an example TanStack Start server function (`createServerFn`) — the "API as a function" pattern.
- **Auth is a plugin** (`auth-starter`): sign-in/up, password reset, the authenticated app shell, and the typed oRPC client all arrive when you select it. The base web app is a landing page.
- Endpoint gate middlewares renamed for clarity: `canAccess` / `canEdit`.
- Filesystem-based scheduler: `scheduler({ cron, handler })` files in `resources/<name>/crons/`.

### Requirements

- Node `>= 22.13.0`, pnpm `>= 9.5.0`.
