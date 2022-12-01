---
sidebar_position: 2
---

# Architecture

Every technological decision is driven by simplicity. We believe that product used by people is the only reason why technologies exist. Our goal is to help products stand up on their feet without investing too much on early stages.

## Overview

Our technological choices based on the following main tools: [Next.js](https://nextjs.org/), [React Query](https://react-query.tanstack.com/), [React Hook Form](https://react-hook-form.com/), [Mantine UI](https://mantine.dev/), [Koa.js](https://koajs.com/), [Socket.IO](https://socket.io/), [MongoDB](https://www.mongodb.com/), [Turborepo](https://turbo.build/repo/docs), [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [GitHub Actions](https://github.com/features/actions) and [TypeScript](https://www.typescriptlang.org/).

Events play crucial role in the Ship architecture. Every database change produces an event. We use events to avoid tight coupling, implement business logic and support denormalization.

On a high-level Ship consist of the following parts:
- [**Web**](/docs/web/overview) — frontend service;
- [**API**](/docs/api/overview) — backend service;
- [**Scheduler**](/docs/scheduler.md) - a service that runs background cron jobs;
- [**Migrator**](/docs/migrator.md) - a service that runs MongoDB migrations;
- [**Deployment**](/docs/deployment/kubernetes/overview.md) - deployment scripts and GitHub Actions that deploy an application to the AWS or Digital Ocean Kubernetes cluster;

The image below illustrates the main components and key relationships between them:

![Ship framework](/img/architecture.png)

## Starting application with Turborepo

To run infra and all services -- just run: `npm start` 🚀

### Turborepo: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Run services with Turborepo

```bash
npm turbo-start
```

## Using Ship with Docker

To run infra and all services -- just run: `npm run docker` 🚀

### Docker: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Run services you need:

```bash
./bin/start.sh api web
```

You can also run infra services separately with `./bin/start.sh` bash script.
