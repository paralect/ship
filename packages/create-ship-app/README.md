![Ship](https://github.com/paralect/ship/blob/main/ship.png)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/ship.svg?style=social&label=Watch)](https://github.com/paralect/ship/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/ship.svg?style=social&label=Stars)](https://github.com/paralect/ship/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/ship.svg?style=social)](https://twitter.com/intent/tweet?text=I%2)

The [Ship](https://ship.paralect.com) is a toolkit for makers to **ship** better products faster 🚀.

It is based on several open-source components, resulting from years of hard work by the [Paralect](https://www.paralect.com) team. We carefully select, document, and share our production-ready knowledge with you. Our technological choices are based on the following main tools: [Next.js](https://nextjs.org/), [Tanstack Query](https://tanstack.com/query/latest/), [React Hook Form](https://react-hook-form.com/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Koa.js](https://koajs.com/), [Socket.IO](https://socket.io/), [MongoDB](https://www.mongodb.com/), [Turborepo](https://turbo.build/repo/docs), [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [GitHub Actions](https://github.com/features/actions) and [TypeScript](https://www.typescriptlang.org/).

We encourage developers to share production-ready solutions and help businesses ship something people need as quickly as possible.

## Features

- Full-stack boilerplate tested on production projects 🔥
- Customizable UI with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) 🧱
- Email/password and Google OAuth authentication 🔐
- Plugin system — install pre-built features with a single command 🔌
- Multiple environments support 📝
- Reactive MongoDB [configuration](https://ship.paralect.com/docs/packages/node-mongo) with CUD events publishing 🍃
- [Kubernetes](https://ship.paralect.com/docs/deployment/kubernetes/overview) and [DO Apps](https://ship.paralect.com/docs/deployment/digital-ocean-apps) deployment for AWS and Digital Ocean platforms ☁
- Turborepo packages sharing 🏎
- Files upload to cloud storage 🗃
- Sendgrid and React Email emails 📧
- Websockets 🔌
- Database [migrations](https://ship.paralect.com/docs/migrator) 🌖
- [CRON jobs](https://ship.paralect.com/docs/scheduler) ⏰
- Logging and monitoring 📈
- Code linting and testing ⚙️
- CI/CD 🤖

## Quick Start

```shell
npx create-ship-app@latest init
```

## Plugins

Extend your project with pre-built features using the plugin system:

```shell
npx create-ship-app@latest install <plugin-name>
```

Available plugins:

| Plugin | Description |
|---|---|
| `stripe-subscriptions` | Subscription billing with Stripe Checkout, webhooks, and a pricing page |
| `ai-chat` | AI chat with streaming responses powered by Google Gemini |

See the [Plugins documentation](https://ship.paralect.com/docs/plugins/overview) for details.

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
