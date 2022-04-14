---
sidebar_position: 2
---

# Architecture

Every technological decision is driven by simplicity. We believe that product used by people is the only reason why technologies exist. Our goal is to help products stand up on their feet without investing too much on early stages.

## Overview

Our technological choices based on the following tools: React, Next.JS Node.JS, MongoDB, Kubernetes, Docker and Koa. Events play crucial role in the Ship architecture. Every database change produces an event. We use events to avoid tight coupling, implement business logic and support denormalization.


On a high-level Ship consist of the following parts:
- `API service` — a service for writing simple REST API ([reference](./api-reference)).
- `Frontend service` — a better version of react-create-app optimized for simplicity.
- `CI/CD automation` — deployment scripts and GitHub actions that deploy an application to the AWS or Digital Ocean Kubernetes cluster.

The image below illustrates the main components and key relationships between them: 
![Ship framework](/img/ship_framework_2.png)

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
