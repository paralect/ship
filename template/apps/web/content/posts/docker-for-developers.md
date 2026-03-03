---
title: Docker for Developers
date: 2024-04-01
image: /images/ship-flight.svg
authorName: David Kim
authorImage: null
excerpt: Learn Docker basics and containerize your applications like a pro.
tags: [docker, devops, containers, deployment]
published: true
---

## Why Docker?

- Consistent environments across machines
- Easy dependency management
- Simplified deployment
- Better resource utilization

## Basic Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose

For multi-container applications:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - '3000:3000'
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
```

## Best Practices

1. Use multi-stage builds
2. Minimize layer count
3. Don't run as root
4. Use .dockerignore

Start containerizing today!
