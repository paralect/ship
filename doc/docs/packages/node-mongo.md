---
sidebar_position: 1
---

# node-mongo

[![npm version](https://badge.fury.io/js/%40paralect%2Fnode-mongo.svg)](https://badge.fury.io/js/%40paralect%2Fnode-mongo)

Lightweight reactive extension to official MongoDB [driver](https://www.npmjs.com/package/mongodb) for Node.js.

## Features

* **ObjectId mapping**. Automatically converts `_id` field from the `ObjectId` to a `string`.
* ️️**Reactive**. Fires events as document created, updated or deleted from database;
* **CUD operations timestamps**. Automatically sets `createdOn`, `updatedOn`, `deletedOn` timestamps for CUD operations;
* **Schema validation**. Validates your data before save;
* **Paging**. Implements high level paging API;
* **Default queries**. You can add default queries that will be added for all find operations;
* **Soft delete**. By default data doesn't removed, but marked with `deletedOn` field;
* **Extendable**. API easily extendable, you can add new methods or override existing;
* **Outbox support**. node-mongo can create collections with `_outbox` postfix that stores all CUD events, it can be used for implementing [transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html) pattern;

The following example shows some of these features:

```typescript
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

await userService.updateOne(
  { _id: '62670b6204f1aab85e5033dc' },
  (doc) => ({ firstName: 'Mark' }),
);

eventBus.onUpdated<User>('users', ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
  await userService.atomic.updateOne(
    { _id: data.doc._id },
    { $set: { fullName: `${data.doc.firstName} ${data.doc.lastName}` } },
  );
});
```

## Installation

```
npm i @paralect/node-mongo
```

## Connect to Database

Usually, you need to define a file called `database` that does two things:
1. Creates database instance and connects to the database;
2. Exposes factory method `createService` to create different [Services](#Services) to work with MongoDB;

```typescript title=database.ts
import { Database, Service, ServiceOptions } from '@paralect/node-mongo';

const connectionString = 'mongodb://localhost:27017';
const dbName = 'home-db';

const database = new Database(connectionString, dbName);
database.connect();

function createService<T>(collectionName: string, options: ServiceOptions = {}) {
  return new Service<T>(collectionName, database, options);
}

export default { createService };
```

## Services

Service it is a collection's wrapper of mongodb driver that adds all node-mongo features.   
Under the hood it uses collection native methods.

```typescript title=user.service.ts
import Joi from 'joi';
import { createService } from 'database';

type User = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date;
  fullName: string;
}

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  fullName: Joi.string().required(),
});

const service = db.createService<User>('users', { schema });

export default service;
```

```typescript title=update-user.ts
import userService from 'user.service';

await userService.insertOne({ fullName: 'Max' });
```

## Reactivity

The key feature of the `node-mongo` is that every create, update or delete operation publishes CUD event.

- `${collectionName}.created`
- `${collectionName}.updated`
- `${collectionName}.deleted`

Events are used to easily update denormalized data and also to implement complex business logic without tight coupling of different entities.

Most of **[Main API](#main)** publishes events.

**[Atomic API](#atomic)** **do not publish events** and usually used to update denormalized data.

:::tip

Most the time you should be using **[Main API](#main)**.

:::

SDK support two kind of events:

### In-memory events

- Enabled by default;
- Events can be lost on service failure;  
- Events are stored in `eventBus` (Node.js EventEmitter instance);
- For handling this type of events you will use **[Events API](#events)**;
- Designed for transferring events inside one Node.js process. Events handlers listens node-mongo `eventBus`.

### Transactional events

- Can be enabled by setting `{ outbox: true }` when creating service;
- Guarantee that every database write will produce an event;
- Events are stored in special collections with `_outbox` postfix;
- For handling this type of events you will use `watch` (method for working with Change Streams) on outbox table;
- Designed for transferring events to messages broker like Kafka. Events handlers should listens message broker events (You need to implement this layer yourself).

:::tip

On start of project we recommend using `in-memory` event, when your application becomes more complex you should migrate to `transactional events`.

:::

## API

### Main

#### `service.updateOne(query, updateFn, options)`

```typescript
const updatedUser = await usersService.updateOne(
  { _id: u._id },
  (doc) => ({ fullName: 'Updated fullname' }),
);
```

Updates a single document and returns it. Returns `null` if document was not found or none of the fields have changed.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- updateFn: `(doc: T) => Partial<T>`;  
Function that accepts current document and returns object containing fields to update.
- options: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/UpdateOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<T | null>`.

| Functionality       | Status  |
| ------------- | --------|
| [`addQueryDefaults`](#addquerydefaults) and [`validateQuery`](#validatequery) | ✅ |
| Schema validation |   ✅ |
| Updates `updatedOn` timestamp if `{ addUpdatedOnField: true }` option was passed when creating service |   ✅ |
| Fires `${collectionName}.updated` event | ✅ |

### Atomic

#### `service.atomic.updateOne(filter, update, options)`

```typescript
await userService.atomic.updateOne(
 { _id: u._id },
 { $set: { fullName: `${u.firstName} ${u.lastName}` } },
);
```

Updates a single document.

**Parameters**

**Returns** 

| Functionality       | Status  |
| ------------- | --------|
| [`addQueryDefaults`](#addquerydefaults) and [`validateQuery`](#validatequery) | ❌ |
| Schema validation |   ❌ |
| Updates `updatedOn` timestamp if `{ addUpdatedOnField: true }` option was passed when creating service |   ✅ |
| Fires `${collectionName}.updated` event | ❌ |


### Internal

#### addQueryDefaults

#### validateQuery

#### validateSchema

### Events

### Types

#### QueryDefaultsOptions

## Extending API

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
