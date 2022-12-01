---
sidebar_position: 1
---

# Introduction

![Introduction](/img/ship.png)

The **[Ship](https://ship.paralect.com/)** is a Full-Stack Node.js boilerplate that will help you build and launch products faster. You can focus on getting things done, not building infrastructure.

Ship uses simple tools and approaches and has built-in support for everything from the frontend to CI/CD automation. The Ship was first created in 2015 and since then we keep testing it on real products at [**Paralect**](https://www.paralect.com/).

## Key principles

### **😊 Simplicity**
We use the most simple solutions in every part of the Ship. They are easier to understand, test, and maintain.

### **📈 Product comes first**
Our jobs from engineer to CEO only exist because there are customers who use the products we create. We encourage developers to focus on a product more than on technology. Get things done as quickly as possible with the Ship.

### **🚀 Production ready**
You can use Ship to create production-ready products. We prefer to use well-tested technologies.

### **🥷 For developers**
Ship is written for developers and easy to use and understand. We write documentation to explain how things work.

## Getting started

The best way to get started with Ship is to use **[Ship CLI](./packages/create-ship-app.md)** to bootstrap your project.

```shell
npx create-ship-app@latest init
```

This command will create everything you need to develop, launch locally and deploy your product.

## Next steps
### Launch your project

We use [Turborepo](https://turborepo.org/docs) for managing monorepo.
To run infra and all services -- just run: `npm start` 🚀

### Learn key concepts

Learn about Ship **[architecture](./architecture.md)**  and key components(**[Web](./web/overview.md)**, **[API](./api/overview.md)**, **[Deployment](./deployment/kubernetes/overview.md)**, **[Migrator](./migrator.md)**, **[Scheduler](./scheduler.md)**).

## .NET

There is a .NET version of Ship. Documentation does not cover it, but **[Web](./web/overview.md)** and **[Deployment](./deployment/kubernetes/overview.md)** sections will be useful because they are the same as for Node.js.
