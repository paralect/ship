![Ship](ship.png)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/ship.svg?style=social&label=Watch)](https://github.com/paralect/ship/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/ship.svg?style=social&label=Stars)](https://github.com/paralect/ship/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/ship.svg?style=social)](https://twitter.com/intent/tweet?text=I%2)

The [Ship](https://ship.paralect.com) is an AI-native, batteries-included full-stack TypeScript SaaS starter — a toolkit for makers to **ship** better products faster 🚀.

> **Build products, not boilerplate.**

It is based on several open-source components, resulting from years of hard work by the [Paralect](https://www.paralect.com) team. We carefully select, document, and share our production-ready knowledge with you — and write it so coding agents have ground truth and one obvious way to do things.

**Stack:** [TanStack Start](https://tanstack.com/start) (SPA) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) + [shadcn/ui](https://ui.shadcn.com/) + [Tailwind v4](https://tailwindcss.com/) on the web; [Hono](https://hono.dev/) + [oRPC](https://orpc.unnoq.com/) + [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) + [better-auth](https://better-auth.com/) on the API; [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for forms; [Socket.IO](https://socket.io/); [Turborepo](https://turbo.build/repo/docs); [pnpm](https://pnpm.io/); [Docker](https://www.docker.com/); [TypeScript](https://www.typescriptlang.org/).

## Two shapes

`@paralect/ship` scaffolds a monorepo in one of two shapes:

- **PostgreSQL + TanStack Start (full-stack)** — a Hono + oRPC + Drizzle API (`apps/api`) and a TanStack Start web app (`apps/web`), with end-to-end type safety flowing from the API to the client.
- **TanStack Start web-only** — a standalone SPA (`apps/web`) with no separate API; backend logic lives in type-safe **server functions** that run on the Start server.

Auth, file storage, email, AI chat and an admin panel are **plugins** you opt into — each copies into your codebase, so you own and can edit every line.

We encourage developers to share production-ready solutions and help businesses ship something people need as quickly as possible.

## Features

- Full-stack boilerplate tested on production projects 🔥
- Plugin system — feature add-ons (admin, notes, ai-chat, files, …) merge into the template via `pnpm plugin:dev` 🔌
- Filesystem-routed oRPC API with auto-generated typed client and contract 🛣
- `DbService<T>` Drizzle wrappers with a relations generic for relation loading (`with`/`columns`), typed `transaction()`, and mutation event-bus hooks ⚙️
- shadcn/ui primitives + Tailwind v4 `@theme` tokens + ported widgets (`AppDrawer`, `PillTabBar`, `ContentLayout`) 🧱
- Auth flows out of the box: email/password + verification + reset + Google OAuth via better-auth 🔐
- File upload via S3-compatible storage (Garage locally, Wasabi/AWS in prod) 🗃
- React Email templates + Resend delivery 📧
- Socket.IO websockets with typed cross-server emitter 🔌
- Drizzle migrations + `db:push` + seed scripts 🌖
- Scheduled jobs runner ⏰
- Multi-environment config validated via zod 📝
- Logging (Winston), CI-friendly type checks, lint, format ⚙️

## Quick Start

```shell
npx @paralect/ship init
```

`npx create-ship-app@latest init` works too — it resolves to the same CLI.

## [Documentation](https://ship.paralect.com/docs/introduction)

## Why Ship?

Shipping is a crucial part of any new product. The quicker you ship, the more time you have to validate your hypotheses. The quicker you validate your idea, the sooner you know if you're building what people want.

In the rush, developers often ignore quality. Backups, monitoring, proper data validation and many other things seems not so important in the beginning. Sometimes you're lucky, sometimes you're not.

We believe we could ship great products faster while maintaining decent quality, and have a plan for scaling when hypotheses were right.

## Core concepts

* We automatically build Ship using a number of smaller components. Our ultimate goal is to include only the parts you need for your product development.
* Every component is kept as tiny as possible to simplify maintenance and stay up to date with new releases. 
* Ship is always in a production-ready state. We test every release manually to provide a great developer experience. We use Ship to build our products, see more [here](https://www.paralect.com/companies).

## License

Ship is released under the [MIT License](LICENSE).

## Contributing

Join us and share something developers need 👌.
