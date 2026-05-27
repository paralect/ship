![Ship](https://github.com/paralect/ship/blob/main/ship.png)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/ship.svg?style=social&label=Watch)](https://github.com/paralect/ship/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/ship.svg?style=social&label=Stars)](https://github.com/paralect/ship/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/ship.svg?style=social)](https://twitter.com/intent/tweet?text=I%2)

The [Ship](https://ship.paralect.com) is a toolkit for makers to **ship** better products faster 🚀.

It is based on several open-source components, resulting from years of hard work by the [Paralect](https://www.paralect.com) team. We carefully select, document, and share our production-ready knowledge with you.

**Stack:** [TanStack Start](https://tanstack.com/start) (SPA) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) + [shadcn/ui](https://ui.shadcn.com/) + [Tailwind v4](https://tailwindcss.com/) on the web; [Hono](https://hono.dev/) + [oRPC](https://orpc.unnoq.com/) + [Drizzle](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) (or [MongoDB](https://www.mongodb.com/) via plugin) + [better-auth](https://better-auth.com/) on the API; [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/); [Socket.IO](https://socket.io/); [Turborepo](https://turbo.build/repo/docs); [Docker](https://www.docker.com/); [TypeScript](https://www.typescriptlang.org/).

## Quick Start

```shell
npx create-ship-app@latest init
```

The CLI walks you through three choices interactively:

1. **Backend** — `PostgreSQL + Drizzle` (default), `MongoDB + @paralect/node-mongo`, or `none` (web-only; drops `apps/api/`).
2. **Plugins** — multi-select checkbox list (space toggles, enter confirms). Pre-selected: `auth-starter`, `admin`. Other options: `mailer`, `cloud-storage`, `notes`, `ai-chat`. Plugin choices that require a backend are hidden when you pick web-only.
3. **Deployment target** — `Digital Ocean Apps`, `Render`, `DO Managed Kubernetes`, or `AWS EKS`.

The selected DB plugin + chosen feature plugins are copied into `plugins/` next to your new project, so `pnpm plugin:dev` works on first run.

## Features

- Full-stack boilerplate tested on production projects 🔥
- Plugin system — feature add-ons (`auth-starter`, `admin`, `notes`, `ai-chat`, `cloud-storage`, `mailer`, `postgres`/`mongo`) 🔌
- Filesystem-routed oRPC API with auto-generated typed client + contract 🛣
- `DbService<T>` Drizzle wrappers with typed `transaction()` and mutation event hooks ⚙️
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
