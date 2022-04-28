---
sidebar_position: 1
---

# Introduction

The Ship is a framework that will help you build and launch products faster. You can focus on getting things done, not building infrastructure.

Ship uses simple tools and approaches and has built-in support for everything from the frontend to CI/CD automation. The Ship was first created in 2015 and since then we keep testing it on real products.

## Key principles

#### **Simplicity**
We use the most simple solutions in every part of the Ship. They are easier to understand, test, and maintain.

#### **Product comes first**
Our jobs from engineer to CEO only exist because there are customers who use the products we create. We encourage developers to focus on a product more than on technology. Get things done as quickly as possible with the Ship.

#### **Production ready**
You can use Ship to create production-ready products. We prefer to use well-tested technologies.

#### **For developers**
Ship is written for developers and easy to use and understand. We write documentation to explain how things work.

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

We use [lerna](https://github.com/lerna/lerna) to easily install packages in all services.

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
