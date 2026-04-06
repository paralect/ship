# Ship

> Full-Stack Node.js boilerplate — [Next.js](https://nextjs.org/) (Pages Router) + [Koa.js](https://koajs.com/) + [MongoDB](https://www.mongodb.com/) + [TypeScript](https://www.typescriptlang.org/)

## [Documentation](https://ship.paralect.com/docs/introduction)

## Tech Stack

| Layer | Technologies |
|---|---|
| **Web** | Next.js (Pages Router), Tanstack Query, React Hook Form, Tailwind CSS, shadcn/ui |
| **API** | Koa.js, Zod validation, auto-discovered endpoints |
| **Database** | MongoDB with [@paralect/node-mongo](https://ship.paralect.com/docs/packages/node-mongo) |
| **Shared** | Auto-generated typed API client, Zod schemas |
| **Infra** | Docker, Turborepo, Redis, GitHub Actions |
| **Deployment** | Digital Ocean Apps, Render, Kubernetes (DO / AWS EKS) |

## Prerequisites

This project requires specific versions of Node.js and pnpm. Please check the `engines` and `packageManager` fields in `package.json` for the required versions.

### Node.js

If you're using [nvm](https://github.com/nvm-sh/nvm), you can automatically switch to the correct Node.js version by running:
```sh
nvm use
```

This will read the version from the `.nvmrc` file and switch to it automatically.

### pnpm

If you have [Corepack](https://nodejs.org/api/corepack.html) enabled (included with Node.js 16.10+), pnpm will automatically use the version specified in the `packageManager` field of `package.json`. You can enable Corepack by running:
```sh
corepack enable
```

## Starting Application with Turborepo 🚀

To run the infrastructure and all services -- just run:
```sh
pnpm start
```

### Running Infra and Services Separately with Turborepo

1. Start base infrastructure services in Docker containers:
    ```sh
    pnpm run infra
    ```
2. Run the services with Turborepo:
    ```sh
    pnpm run turbo-start
    ```

## Using Ship with Docker

To run the infrastructure and all services, execute:
```sh
pnpm run docker
```

### Running Infra and Services Separately with Docker

1. Start base infrastructure services in Docker containers:
    ```sh
    pnpm run infra
    ```
2. Run the services you need:
    ```sh
    ./bin/start.sh api web
    ```

You can also run infrastructure services separately using the `./bin/start.sh` bash script.

## Plugins

Extend your project with pre-built features:

```sh
npx create-ship-app@latest install <plugin-name>
```

Available plugins: `stripe-subscriptions`, `ai-chat`. See [Plugins docs](https://ship.paralect.com/docs/plugins/overview).
