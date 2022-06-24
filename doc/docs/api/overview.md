---
sidebar_position: 1
---

# Overview

:::info

It's the draft version of **API** documentation, the articles contains some deprecated details. This section will be refactored and actualized soon ✨.

:::

`/api` is a source folder for three independent services: 
- API — REST API, entry file is `/api/src/app.ts`
- Migrator — small utility that runs MongoDB migrations, entry file is `/api/src/migrator.ts`
- Scheduler — standalone service, that runs background jobs, entry file is `/api/src/scheduler.ts`

## What is resource?

From the outside world, the resource is a set of REST API endpoints that allow managing a particular business entity (e.x. user). Inside, the resource includes methods to work with the database, business logic, database data, request validation, events and event handlers. Most of the time, a resource has 1 on 1 mapping to the database entity. The resource describes how you can work with any given entity. E.x. User API needs to create new users, edit an existing user, list all users. 

## Resource components

A resource represents on REST endpoint and most of the time one database table or collection. The resource usually consists of the following parts:
- [API actions](./api-action). Each action consists of three things: the handler, validator, and route.
- [A data service](./data-service). Typically this service is used to access databases. For simplicity, we mix the data access layer with the domain operations associated with a given entity.
- [Event handlers](./event-handler). Event handlers include any updates that come as a reaction to what happens outside the boundaries of any given entity.
- [Workflows](./workflow). They are essentially updates that require multiple resources to work together. E.x. User Signup is usually a workflow, as it requires to a) create user b) create company 3) create authentication token.
- [Data schema](./data-schema). We use [Joi](https://joi.dev/api/?v=17.6.0) to define database schemas and validate them in runtime. (we’ve used [JSON Schema](https://json-schema.org/) in the past).
- Type definitions. If typescript is used for the project.

## Example stucture

Here is the resource structure example:

![Resource structure](/img/api_resource_structure.png)
