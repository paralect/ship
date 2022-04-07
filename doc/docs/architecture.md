---
sidebar_position: 2
---

# Architecture

Every our decision is driven by simplicity. We beleive that product used by people is the only reason why technologies exists. Our goal is to help products stand up on feet without investing to much into technology at start. 

## Overview

Our technological choices based on the following tools: React, Next.JS Node.JS, MongoDB, Kubernetes, Docker and Koa. Events play crucial role in the Ship architecture. Every database change produces an event. We use events to avoid tight coupling, implement business logic and support denormalization.


On a high-level Ship consist of the following parts:
- `API service` — a service for writing simple REST API ([reference](./api-reference)).
- `Frontend service` — a better version of react-create-app optimized for simplicity.
- `CI/CD automation` — deployment scripts and GitHub actions that deploy an application to the AWS or Digital Ocean Kubernetes cluster.

The image below illustrates the main components and key relationships between them: 
![Ship framework](/img/ship_framework.png)

## API service

`/api` is a source for three independent services: 
- API — REST API, entry file is `/api/src/app.js`
- Migrator — small utility that runs MongoDB migrations, entry file is `/api/src/migrator.js`
- Scheduler — standalone service, that runs background jobs, entry file is `/api/src/scheduler.js`

### API Resource structure

From the outside world, the resource is a set of REST API endpoints that allow managing a particular business entity (e.x. user). Inside, the resource includes methods to work with the database, business logic, database data, request validation, events and event handlers. Most of the time, a resource has 1 on 1 mapping to the database entity. The resource describes how you can work with any given entity. E.x. User API needs to create new users, edit an existing user, list all users. Here is the resource structure example:
![Resource structure](/img/api_resource_structure.png)

A resource represents on REST endpoint and most of the time one database table or collection. The resource usually consists of the following parts:
- [REST API actions](./api-reference.md#rest-api-action). Each action consists of three things: the handler, validator, and route.
- [A data service](./api-reference.md#data-service). Typically this service is used to access databases. For simplicity, we mix the data access layer with the domain operations associated with a given entity.
- [Event handlers](./api-reference.md#event-handler). Event handlers include any updates that come as a reaction to what happens outside the boundaries of any given entity.
- [Workflows](./api-reference.md#workflow). They are essentially updates that require multiple resources to work together. E.x. User Signup is usually a workflow, as it requires to a) create user b) create company 3) create authentication token.
- [Database schema](./api-reference.md#database-schema). We use [Joi](https://joi.dev/api/?v=17.6.0) to define database schemas and validate them in runtime. (we’ve used [JSON Schema](https://json-schema.org/) in the past).
- Type definitions. If typescript is used for the project.


### API Resource limitations

We want to keep things together that belong together and keep them apart if they belong apart. With the structure and limitations above every resource has clear boundaries and every domain operation related to the resource can be found in the data service or workflow.

Limitations are very important. We use them to keep things predictable and simple:
- **All** entity updates should stay within resource folder. Direct database updates allowed in data services, handlers and actions. This restriction make sure that entity updates are not exposed outside the resource. This enables the discoverability of all updates and simplifies resource changes.
- Complex read operations (e.x. aggregation, complex queries) must be defined in the data service as well.
- Put things as close as possible to the place where they are used. E.x. data schema is placed side by side with data service, where it is used.
- Two data services can not use each other directly. You may use two services together in actions or (better!) in workflows.

### Event handlers & denormalization

The picture below shows the 'events part' of a sample API implementation:
![Event handlers](/img/api_event_handlers.png)

In Ship, every resource produces events on create, update and delete database operations. As a result, we have all events in one place and these events describe system behavior. Stripe has [an event for any change](https://stripe.com/docs/api/events/types) that happens in their system. We do pretty much the same.

### Dependencies relatively to the /src folder

We require files from the current folder or from the root, `../` is not allowed. E.x.:

```typescript
import service from 'resources/user/user.service';
```

This makes it easy to move files around without breaking an app and also much simpler to understand where the actual file is located, compared to something like: `../../user.service`.


## Docker

We use docker to run and deploy services on production and locally. We also use docker-compose to describe all services in a development environment. Because of this, you can start a project easily on any machine by running this command: 

```shell
docker-compose up --build
```

For simplicity, the command is wrapped into a shell script:

```shell
./bin/start.sh
```

Take a look at `docker-compose.yml` to see all services.
