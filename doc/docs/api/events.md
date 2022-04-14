---
sidebar_position: 7
---

# CUD events

## Overview

**CUD events (Create, Update, Delete)** — is a set of events published by `data layer` (`@paralect/node-mongo` npm package). Events are the best solve three main problems:

- nicely update denormalized data (e.x.: use user.created and user.deleted to maintain usersCount field in the company)
- avoid tight coupling between your app entities (e.x. if you need to keep user updates history you can just subscribe to user updates in the history resource vs using history.service inside user.resource and marry user and history)
- they’re the best to integrate with external systems (e.x. events can be published as web hooks and webhooks can power real time Zapier triggers)


## Examples

There are three types of events:

- entity.created event (e.x. user.created)
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.created',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
  },
};
```

- entity.updated event (e.x. user.updated). We use [diff](https://github.com/flitbit/diff) to calculate the raw difference between previous and current version of updated entity. diff object is too complex and should not be used directly. Instead, fields required by business logic should be exposed via change object e.x. previousUserEmail
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.updated',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
    diff: {},
    change: {}
  },
};
```

- entity.removed event (e.x. user.removed). 
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.removed',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
  },
};
```
