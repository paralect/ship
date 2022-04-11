
# Node Mongo

[![npm version](https://badge.fury.io/js/%40paralect%2Fnode-mongo.svg)](https://badge.fury.io/js/%40paralect%2Fnode-mongo)

Node Mongo is reactive extension to MongoDB API.

## Features

* ️️**Reactive**. Fires events as document stored, updated or deleted from database
* **Paging**. Implements high level paging API
* **Schema validation**. Validates your data before save

## Installation

```
npm i @paralect/node-mongo
```

## Documentation

### Migrate from v2 to v3

1. Methods `updateOne` and `updateMany` were removed. You should use `update` to perform update of single document, matched by a query. There is no replacement for `updateMany`, normally you should just perform multiple individual updates.
2. `service.count()` renamed into `service.countDocuments` to match MongoDB driver.
3. Use `service.atomic.updateMany` instead `service.atomic.update` to match MongoDB.
4. `service.aggregate()` now returns cursor instead of list of documents. You can add `toArray()`
5. Service accepts `schema` object instead of `validateSchema` method.

### Connect

Usually, you need to define a file called `database` is does two things:
1. Creates database instance and connects to the database
2. Exposed factory method `createService` to create different services to work with MongoDB. 

```typescript
import config from 'config';
import { Database, Service, ServiceOptions } from '@paralect/node-mongo';

const connectionString = 'mongodb://localhost:27017';
const dbName = 'home-db';
const database = new Database(connectionString, dbName);
database.connect();

// Extended service can be used here.
function createService<T>(collectionName: string, options: ServiceOptions = {}) {
  return new Service<T>(collectionName, database, options);
}

export default {
  database,
  createService,
};
```

See [how to add additional functionality to base serivce](#extend)


### Schema validation
```javascript
const Joi = require('Joi');

const userSchema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  name: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
});

// Pass schema object to enable schema validation
const userService = db.createService('users', { schema: userSchema });
```

### Extend

The whole idea is to import service and extend it with custom methods:

```typescript
import { Service } from '@paralect/node-mongo';

class CustomService<T> extends Service<T> {
  createOrUpdate = async (query: any, updateCallback: (item?: T) => Partial<T>) => {
    const docExists = await this.exists(query);
    if (!docExists) {
      const newDoc = updateCallback();
      return this.create(newDoc);
    }

    return this.update(query, doc => {
      return updateCallback(doc);
    });
  };
}

export default CustomService;
```

### Query data

```typescript
// find one document
const user = await userService.findOne({ name: 'Bob' });

// find many documents with pagination
const {results, pagesCount, count } = await userService.find(
  { name: 'Bob' },
  { page: 1, perPage: 30 },
);
```

### Create or update data (and publish CUD events)

The key difference of the `@paralect/node-mongo` sdk is that every create, update or remove operation peforms 
an udpate and also publeshes CUD event. Events are used to easily update denormalized data and also to implement 
complex business logic without tight coupling of different entities.

- Reactive updates (every update publishes event)
  - [create](#create) — create one or many documents, publishes `document.created` event
  - [update](#update) — update one document, publishes `document.updated` event
  - [remove](#remove) — remove document, publishes `document.removed`
  - [removeSoft](#removeSoft) — set `deleteOn` field and publish `document.removed` event 

Atomic udpates **do not publish events** and usually used to update denormalized data. Most the time you should be using reactive updates.

- Atomic updates (events are not published)
  - `atomic.deleteMany`
  - `atomic.insertMany`
  - `atomic.updateMany`
  - `findOneAndUpdate`

[API Reference V2](API.md).

#### create 

```typescript
const users = await userService.create([
  { name: 'Alex' },
  { name: 'Bob' },
]);
```

#### update 

Update using callback function:
```typescript
const updatedUser = await userService.update({ _id: '1' }, (doc) => {
  doc.name = 'Alex';
});
```

Update by returning fields you need to update:
```typescript
const updatedUser = await userService.update({ _id: '1' }, () => ({ name: 'Alex' }));
```

### remove
```typescript
const removedUser = await userService.remove({ _id: '1' });
```

### removeSoft
```typescript
const removedUser = await userService.removeSoft({ _id: '1' });
```

### Event handlers

SDK support two kind of events:
- `in memory events` (published by default), can be lost on service failure, work out of the box.
- `transactional events` guarantee that every database write will also produce an event. Transactional events can be enabled by setting `{ outbox: true }` when creating service. Transactional events require additonal infrastructure components.

To subscribe to the in memory events you can just do following:

```typescript
import { inMemoryEventBus, InMemoryEvent } from '@paralect/node-mongo';

type UserCreatedType = InMemoryEvent<any>;
type UserUpdatedType = InMemoryEvent<any>;
type UserRemovedType = InMemoryEvent<any>;

inMemoryEventBus.on('user.created', (doc: UserCreatedType) => {});

inMemoryEventBus.on('user.updated', (doc: UserUpdatedType) => {});

inMemoryEventBus.on('user.removed', (doc: UserRemovedType) => {});
```

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

Every release is documented on the Github [Releases](https://github.com/paralect/node-mongo/releases) page.
