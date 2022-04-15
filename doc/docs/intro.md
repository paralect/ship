---
sidebar_position: 1
---

# Introduction

Ship is a framework that will help you build and launch products faster. You can focus on getting things done, not building infrastructure.

Ship uses simple tools and approaches and has built-in support for everything from the frontend to CI/CD automation. Ship was first created in 2015 and since then we keep testing it on real products.

## Key priciples

### Simplicity
We use most simple solutions in every part of the Ship. They are easier to understand, test and maintain.

### Product come first
Our jobs from engineer to CEO are only exist because there are customers who use products we create. We encourage to focus on a product more than on technology and get things done as quick as possible. 

### Production ready
You can use ship to create production-ready products. We prefer to used well tested technologies to make sure this.

### For developers
Ship is written for developers, so we try to make it easy to use and understand. We write documentation to explain how things work.

## Getting started

The best way to get started with Ship is to use Ship CLI to bootstrap your project.

```
npx i create-ship-app
```

Run command to create your project structure
```
npx create-ship-app my-project
```

This command will create everything you need to develop, launch locally and deploy your product. Usually, complete configuration from start to deployment takes less than 20 minutes.

## Next steps
### Launch your project

We use [lerna](https://github.com/lerna/lerna) to easily install packages in the all services.

```shell
# install root level packages
npm i

# install dependencies in all services (web & api)
npm run bootstrap 

# launch project
./bin/start.sh
```

### Learn key concepts

1. Learn about Ship [architecture and key components](./architecture.md).
2. Learn about [API](./api/overview.md)


### Deploy project

TO be done
