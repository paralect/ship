---
sidebar_position: 2
---

# create-ship-app

[![npm version](https://badge.fury.io/js/create-ship-app.svg)](https://badge.fury.io/js/create-ship-app)

Simple CLI tool for bootstrapping Ship applications. Downloads actual versions of packages and services from Ship [monorepo](https://github.com/paralect/ship) and configures them to run.

![Init project](/img/deployment/digital-ocean/init-project.png)

Check out [example](https://github.com/paralect/ship/tree/master/examples/base) of the built Ship application.

## Build options

### Build type

- Only Frontend - includes [**Web**](/docs/web/overview) service;
- Only Backend - includes [**API**](/docs/api/overview), [**Scheduler**](/docs/scheduler.md) and [**Migrator**](/docs/migrator.md) services;
- Full-Stack - includes [**Web**](/docs/web/overview), [**API**](/docs/api/overview), [**Scheduler**](/docs/scheduler.md), [**Migrator**](/docs/migrator.md) and [**Deployment**](/docs/deployment/kubernetes/overview.md) services;

### API type

- [**Koa.js**](/docs/api/overview)
- .NET MongoDB
- .NET PostgreSQL

### Deployment type

- [**Digital Ocean Apps**](/docs/deployment/digital-ocean-apps.md)
- [**Digital Ocean Managed Kubernetes**](/docs/deployment/kubernetes/digital-ocean.md)
- [**AWS EKS**](/docs/deployment/kubernetes/aws.md)

## Usage

```shell
npx create-ship-app init
```

or

```shell
npx create-ship-app my-project
```
