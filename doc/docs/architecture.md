---
sidebar_position: 2
---

# Architecture

Every technological decision is driven by simplicity. We believe that product used by people is the only reason why technologies exist. Our goal is to help products stand up on their feet without investing too much on early stages.

## Overview

Our technological choices based on the following main tools: [Next.js](https://nextjs.org/), [React Query](https://react-query.tanstack.com/), [Mantine UI](https://mantine.dev/), [Koa.js](https://koajs.com/), [Socket.IO](https://socket.io/), [MongoDB](https://www.mongodb.com/), [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [GitHub Actions](https://github.com/features/actions) and [TypeScript](https://www.typescriptlang.org/).

Events play crucial role in the Ship architecture. Every database change produces an event. We use events to avoid tight coupling, implement business logic and support denormalization.

On a high-level Ship consist of the following parts:
- [**Web**](/docs/web/overview) — frontend service;
- [**API**](/docs/api/overview) — backend service;
- [**Scheduler**](/docs/scheduler.md) - a service that runs background cron jobs;
- [**Migrator**](/docs/migrator.md) - a service that runs MongoDB migrations;
- [**Deployment**](/docs/deployment/overview.md) - deployment scripts and GitHub Actions that deploy an application to the AWS or Digital Ocean Kubernetes cluster;

The image below illustrates the main components and key relationships between them:

![Ship framework](/img/architecture.png)

## Docker

We use docker to run and deploy services on production and locally. We also use docker-compose to describe all services in a development environment. Because of this, you can start a project easily on any machine by running this command: 

```shell
docker-compose up --build
```

For simplicity, the command is wrapped into a shell script that executes with the `npm start` command.

Take a look at `docker-compose.yml` to see all services.
