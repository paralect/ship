---
sidebar_position: 1
---

# node-mongo

[![npm version](https://badge.fury.io/js/%40paralect%2Fnode-mongo.svg)](https://badge.fury.io/js/%40paralect%2Fnode-mongo)

Lightweight reactive extension to official Node.js MongoDB [driver](https://mongodb.github.io/node-mongodb-native/4.10/).

## Features

* **ObjectId mapping**. Automatically converts the `_id` field from the `ObjectId` to a `string`.
* ️️**Reactive**. Fires events as a document created, updated, or deleted from the database;
* **CUD operations timestamps**. Automatically sets `createdOn`, `updatedOn`, and `deletedOn` timestamps for CUD operations;
* **Schema validation**. Validates your data before saving;
* **Paging**. Implements high-level paging API;
* **Soft delete**. By default, documents don't remove from the collection, but are marked with the `deletedOn` field;
* **Extendable**. API is easily extendable, you can add new methods or override existing ones;
* **Outbox support**. node-mongo can create collections with `_outbox` postfix that stores all CUD events for implementing the [transactional outbox](about:blank) pattern;

The following example shows some of these features:

```typescript
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

await userService.updateOne(
  { _id: '62670b6204f1aab85e5033dc' },
  (doc) => ({ firstName: 'Mark' }),
);

eventBus.onUpdated('users', ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
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

Usually, you need to define a file called `db` that does two things:
1. Creates database instance and connects to the database;
2. Exposes factory method `createService` to create different [Services](#services) to work with MongoDB;

```typescript title=db.ts
import { Database, Service, ServiceOptions, IDocument } from '@paralect/node-mongo';

import config from 'config';

const database = new Database(config.mongo.connection, config.mongo.dbName);
database.connect();

class CustomService<T extends IDocument> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

export default {
  database,
  createService,
};
```

## Services

Service is a collection wrapper that adds all node-mongo features. Under the hood it uses Node.js MongoDB native methods.

`createService` method returns the service instance. It accepts two parameters: collection name and [ServiceOptions](#serviceoptions).

```typescript title=user.service.ts
import { z } from 'zod';

import db from 'db';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
}).strict();

type User = z.infer<typeof schema>;

const service = db.createService<User>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

export default service;
```

```typescript title=update-user.ts
import userService from 'user.service';

await userService.insertOne({ fullName: 'Max' });
```

## Schema validation
Node-mongo supports any schema library, but we recommend [Zod](https://zod.dev/), due to this ability to generate TypeScript types from the schemas.

### Zod

```typescript
const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
});

type User = z.infer<typeof schema>;

const service = createService<User>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});
```

### Joi

```typescript
const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  fullName: Joi.string().required(),
});

type User = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
};

const service = createService<User>('users', {
  schemaValidator: (obj) => schema.validateAsync(obj),
});

```

:::tip

Node-mongo validates documents before save.

:::

## Reactivity

The key feature of the `node-mongo` is that each create, update or delete operation publishes a CUD event.

- `${collectionName}.created`
- `${collectionName}.updated`
- `${collectionName}.deleted`

Events are used to easily update denormalized data and also to implement complex business logic without tight coupling of different entities.

SDK support two type of events:

### In-memory events

- Enabled by default;
- Events can be lost on service failure;
- Events are stored in `eventBus` (Node.js [EventEmitter](https://nodejs.org/api/events.html#events) instance);
- For handling these events type you will use [Events API](#events);
- Designed for transferring events inside a single Node.js process. Events handlers listens node-mongo `eventBus`.

### Transactional events

- Can be enabled by setting `{ outbox: true }` when creating a service;
- Guarantee that every database write will produce an event;
- Events are stored in special collections with `_outbox` postfix;
- For handling these events type you will use `watch` (method for working with Change Streams) on the outbox table;
- Designed for transferring events to messages broker like Kafka. Events handlers should listen to message broker events (You need to implement this layer yourself).

:::tip

On the project start, we recommend using `in-memory` events. When your application becomes tougher you should migrate to `transactional` events.

:::

## API

### `find`

```typescript
find(
  filter: Filter<T>,
  readConfig: ReadConfig & { page?: number; perPage?: number } = {},
  findOptions: FindOptions = {},
): Promise<FindResult<T>>
```

```typescript
const { results: users, count: usersCount } = await userService.find(
  { status: 'active' },
);
```

Fetches documents that matches the filter. Returns an object with the following fields(`FindResult`):

| Field | Description |
| ------------- | --------|
| results | documents, that matches the filter |
| count | total number of documents, that matches the filter |
| pagesCount | total number of documents, that matches the filter divided by the number of documents per page |

Pass `page` and `perPage` params to get a paginated result. Otherwise, all documents will be returned.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- readConfig: [ReadConfig](#readconfig) `& { page?: number; perPage?: number }`;
- findOptions: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/FindOptions.html);

**Returns** `Promise<FindResult<T>>`.

### `findOne`

```typescript
findOne(
  filter: Filter<T>,
  readConfig: ReadConfig = {},
  findOptions: FindOptions = {},
): Promise<T | null>
```

```typescript
const user = await userService.findOne({ _id: u._id });
```

Fetches the first document that matches the filter. Returns `null` if document was not found.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- readConfig: [`ReadConfig`](#readconfig);
- findOptions: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/FindOptions.html);

**Returns** `Promise<T | null>`.

## Options

### `ServiceOptions`

```typescript
interface ServiceOptions {
  skipDeletedOnDocs?: boolean,
  schemaValidator?: (obj: any) => Promise<any>,
  publishEvents?: boolean,
  addCreatedOnField?: boolean,
  addUpdatedOnField?: boolean,
  outbox?: boolean,
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
}
```

| Option | Description |Default value|
| ------------- | --------|----|
|`skipDeletedOnDocs` |Skip documents with the `deletedOn` field|`true`|
|`schemaValidator` |Validation function that will be called on data save|-|
|`publishEvents` |Publish [CUD events](#reactivity) on save.|`true`|
|`addCreatedOnField` |Set the `createdOn` field to the current timestamp on document creation.|`true`|
|`addUpdatedOnField` |Set `updateOne` field to the current timestamp on the document update.|`true`|
|`outbox`|Use [transactional](#transactional-events) events instead of [in-memory events](#in-memory-events)|`false`|
|`collectionOptions`|MongoDB [CollectionOptions](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/CollectionOptions.html)|`{}`|
|`collectionCreateOptions`|MongoDB [CreateCollectionOptions](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/CreateCollectionOptions.html)|`{}`|

### `CreateConfig`
Overrides `ServiceOptions` parameters for create operations.

```typescript
type CreateConfig = {
  validateSchema?: boolean,
  publishEvents?: boolean,
};
```

### `ReadConfig`
Overrides `ServiceOptions` parameters for read operations.

```typescript
type ReadConfig = {
  skipDeletedOnDocs?: boolean,
};
```

### `UpdateConfig`
Overrides `ServiceOptions` parameters for update operations.

```typescript
type UpdateConfig = {
  skipDeletedOnDocs?: boolean,
  validateSchema?: boolean,
  publishEvents?: boolean,
};
```

### `DeleteConfig`
Overrides `ServiceOptions` parameters for delete operations.

```typescript
type DeleteConfig = {
  skipDeletedOnDocs?: boolean,
  publishEvents?: boolean,
};
```

## Extending API
Extending API for a single service.

```typescript
const service = db.createService<User>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
```

Extending API for all services.

```typescript
const database = new Database(config.mongo.connection, config.mongo.dbName);

class CustomService<T extends IDocument> extends Service<T> {
  createOrUpdate = async (query: any, updateCallback: (item?: T) => Partial<T>) => {
    const docExists = await this.exists(query);

    if (!docExists) {
      const newDoc = updateCallback();
      return this.insertOne(newDoc);
    }

    return this.updateOne(query, (doc) => updateCallback(doc));
  };
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

const userService = createService<UserType>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

await userService.createOrUpdate(
  { _id: 'some-id' },
  () => ({ fullName: 'Max' }),
);
```
