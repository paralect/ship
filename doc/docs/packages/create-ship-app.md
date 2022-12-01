---
sidebar_position: 2
---

# create-ship-app

[![npm version](https://badge.fury.io/js/create-ship-app.svg)](https://badge.fury.io/js/create-ship-app)

Simple CLI tool for bootstrapping Ship applications.  
Downloads actual template from Ship [monorepo](https://github.com/paralect/ship) and configures it to run.

![Init project](/img/deployment/digital-ocean/init-project.png)

## Build options

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
npx create-ship-app@latest init
```

or

```shell
npx create-ship-app@latest my-project
```
