---
sidebar_position: 1
---

# Introduction

Ship is a framework that helps build & launch products fast. To achieve this we use simplest possible solutions depending on the application stage. We use React, Next.JS, Node.JS, MongoDB and Koa.

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
