![Ship](https://github.com/paralect/ship/blob/main/ship.png)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/ship.svg?style=social&label=Watch)](https://github.com/paralect/ship/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/ship.svg?style=social&label=Stars)](https://github.com/paralect/ship/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/ship.svg?style=social)](https://twitter.com/intent/tweet?text=I%2)

**[Ship](https://ship.paralect.com)** is an AI-native, batteries-included full-stack TypeScript SaaS starter. It scaffolds a production-ready monorepo with standardised patterns that you — and your AI agents — can build on without guesswork.

> **Build products, not boilerplate.**

Ship has been live-tested on 100+ products at [Paralect](https://www.paralect.com). 3.0.0 rebuilds it on a modern, type-safe stack and ships first-class context for coding agents.

**Stack:** [TanStack Start](https://tanstack.com/start) (SPA) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) + [shadcn/ui](https://ui.shadcn.com/) + [Tailwind v4](https://tailwindcss.com/) on the web; [Hono](https://hono.dev/) + [oRPC](https://orpc.unnoq.com/) + [Drizzle](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) + [better-auth](https://better-auth.com/) on the API; [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/); [Socket.IO](https://socket.io/); [Turborepo](https://turbo.build/repo/docs); [Docker](https://www.docker.com/); [TypeScript](https://www.typescriptlang.org/).

## Quick Start

```shell
npx @paralect/ship init
```

`npx create-ship-app@latest init` works too — it resolves to the same CLI.

The CLI walks you through three choices interactively:

1. **Setup** — pick one of two shapes (see below).
2. **Plugins** — multi-select checkbox list (space toggles, enter confirms). Pre-selected: `auth-starter`, `admin`. Other options: `mailer`, `cloud-storage`, `notes`, `ai-chat`. Plugins that require a backend are hidden in the web-only shape.
3. **Deployment target** — `Digital Ocean Apps`, `Render`, `DO Managed Kubernetes`, or `AWS EKS`.

Then:

```shell
cd my-ship-app
pnpm start
```

`pnpm start` brings up infrastructure, runs migrations, and starts every service. 🚀

## Two shapes

### PostgreSQL + TanStack Start (full-stack)

A Hono + oRPC + Drizzle API (`apps/api`) and a TanStack Start web app (`apps/web`), with end-to-end type safety flowing from the API to the client. The web app consumes the API through a typed oRPC client — change an endpoint's `.output()` and the web types update on the next build.

### TanStack Start web-only

A standalone TanStack Start SPA (`apps/web`) with no separate API. Your backend logic lives in type-safe **server functions** that run on the Start server and are called straight from a route loader:

```ts
import { createServerFn } from '@tanstack/react-start';

export const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the Start server' };
});
```

SPA mode does **not** disable the server — server functions still execute on the Start/Nitro server. Web-only means no separate API app, not no server.

## AI-native by design

Ship is built so coding agents have ground truth and one obvious way to do things:

- **`AGENTS.md`** at the repo root and scoped to `apps/api` and `apps/web`, plus a progressive-disclosure index of workflow docs.
- **Skills** for the patterns that matter — `no-useEffect`, server functions, scaffolding with the CLI.
- **Codegen** keeps the oRPC router, contract, typed client and `DbService` in sync, so the types an agent reads are always real.
- **Standardised patterns** — every resource owns its endpoints, schemas, jobs, crons and methods, mounted by file path. Less to infer, less to get wrong.

## Features

- Full-stack boilerplate tested on production projects 🔥
- Plugin system — features (`auth-starter`, `admin`, `notes`, `ai-chat`, `cloud-storage`, `mailer`) that **merge into your codebase**, like shadcn/ui 🔌
- Filesystem-routed oRPC API with auto-generated typed client + contract 🛣
- `DbService` Drizzle wrappers with typed `transaction()` and mutation event handlers ⚙️
- shadcn/ui + Tailwind v4 + ported widgets (`AppDrawer`, `PillTabBar`, `ContentLayout`) 🧱
- Auth flows: email/password + verification + reset + Google OAuth (better-auth) 🔐
- File upload via S3-compatible storage (Garage locally, Wasabi/AWS in prod) 🗃
- React Email templates + Resend delivery 📧
- Socket.IO websockets 🔌
- Drizzle migrations + `db:push` + seed scripts 🌖
- Scheduled jobs runner ⏰
- Multi-environment config validated via zod 📝
- Logging (Winston), CI-friendly type checks, lint, format ⚙️

## [Documentation](https://ship.paralect.com/docs/introduction)

## Why Ship?

Shipping is a crucial part of any new product. The quicker you ship, the more time you have to validate your hypotheses. The quicker you validate your idea, the sooner you know if you're building what people want.

In the rush, developers often ignore quality. Backups, monitoring, proper data validation and many other things seem not so important in the beginning. Sometimes you're lucky, sometimes not.

We believe we could ship great products faster, while maintaining decent quality and have a plan for scaling when hypotheses are right.

## Core concepts

- We automatically build Ship out of a number of smaller components. Our ultimate goal is to keep only the parts you need for your product development.
- Every component is kept as tiny as possible to simplify maintenance and stay up to date with new releases.
- Ship is always in a production-ready state. We test every release manually to make sure of a great developer experience. We use Ship to build our products, see more [here](https://www.paralect.com/build-stage).

## License

Ship is released under the [MIT License](https://github.com/paralect/ship/blob/main/LICENSE).

## Contributing

Join us and share something developers need 👌.
