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

## Service API

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
- readConfig: [`ReadConfig`](#readconfig) `& { page?: number; perPage?: number }`;
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

### `updateOne`

```typescript
updateOne: (
  filter: Filter<T>,
  updateFn: (doc: T) => Partial<T>,
  updateConfig: UpdateConfig = {},
  updateOptions: UpdateOptions = {},
): Promise<T | null>
```

```typescript
const updatedUserWithEvent = await userService.updateOne(
  { _id: u._id },
  (doc) => ({ fullName: 'Updated fullname' }),
);

const updatedUser = await userService.updateOne(
  { _id: u._id },
  (doc) => ({ fullName: 'Updated fullname' }),
  { publishEvents: false }
);
```

Updates a single document and returns it. Returns `null` if document was not found.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- updateFn: `(doc: T) => Partial<T>`;  
  Function that accepts current document and returns object containing fields to update.
- updateConfig: [`UpdateConfig`](#updateconfig);
- updateOptions: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateOptions.html);

**Returns** `Promise<T | null>`.

### `updateMany`

```typescript
updateMany: (
  filter: Filter<T>,
  updateFn: (doc: T) => Partial<T>,
  updateConfig: UpdateConfig = {},
  updateOptions: UpdateOptions = {},
): Promise<T[]>
```

```typescript
const updatedUsers = await userService.updateMany(
  { status: 'active' },
  (doc) => ({ isEmailVerified: true }),
);
```

Updates multiple documents that match the query. Returns array with updated documents.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- updateFn: `(doc: T) => Partial<T>`;  
  Function that accepts current document and returns object containing fields to update.
- updateConfig: [`UpdateConfig`](#updateconfig);
- updateOptions: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateOptions.html);

**Returns** `Promise<T[]>`.

### `insertOne`

```typescript
insertOne: (
  object: Partial<T>,
  createConfig: CreateConfig = {},
  insertOneOptions: InsertOneOptions = {},
): Promise<T>
```

```typescript
const user = await userService.insertOne({
  fullName: 'John',
});
```

Inserts a single document into a collection and returns it.

**Parameters**
- object: `Partial<T>`;
- createConfig: [`CreateConfig`](#createconfig);
- insertOneOptions: [`InsertOneOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/InsertOneOptions.html);

**Returns** `Promise<T>`.

### `insertMany`

```typescript
insertMany: (
  objects: Partial<T>[],
  createConfig: CreateConfig = {},
  bulkWriteOptions: BulkWriteOptions = {},
): Promise<T[]>
```

```typescript
const users = await userService.insertMany([
  { fullName: 'John' },
  { fullName: 'Kobe' },
]);
```

Inserts multiple documents into a collection and returns them.

**Parameters**
- objects: `Partial<T>[]`;
- createConfig: [`CreateConfig`](#createconfig);
- bulkWriteOptions: [`BulkWriteOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/BulkWriteOptions.html);

**Returns** `Promise<T[]>`.

### `deleteSoft`

```typescript
deleteSoft: (
  filter: Filter<T>,
  deleteConfig: DeleteConfig = {},
  deleteOptions: DeleteOptions = {},
): Promise<T[]>
```

```typescript
const deletedUsers = await userService.deleteSoft(
  { status: 'deactivated' },
);
```

Adds `deletedOn` field to the documents that match the query and returns them.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- deleteConfig: [`DeleteConfig`](#deleteconfig);
- deleteOptions: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/DeleteOptions.html);

**Returns** `Promise<T[]>`.

### `deleteOne`

```typescript
deleteOne: (
  filter: Filter<T>,
  deleteConfig: DeleteConfig = {},
  deleteOptions: DeleteOptions = {},
): Promise<T | null>
```

```typescript
const deletedUser = await userService.deleteOne(
  { _id: u._id },
);
```

Deletes a single document and returns it. Returns `null` if document was not found.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- deleteConfig: [`DeleteConfig`](#deleteconfig);
- deleteOptions: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/DeleteOptions.html);

**Returns** `Promise<T | null>`.

### `deleteMany`

```typescript
deleteMany: (
  filter: Filter<T>,
  deleteConfig: DeleteConfig = {},
  deleteOptions: DeleteOptions = {},
): Promise<T[]>
```

```typescript
const deletedUsers = await userService.deleteMany(
  { status: 'deactivated' },
);
```

Deletes multiple documents that match the query. Returns array with deleted documents.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- deleteConfig: [`DeleteConfig`](#deleteconfig);
- deleteOptions: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/DeleteOptions.html);

**Returns** `Promise<T[]>`.

### `replaceOne`

```typescript
replaceOne: (
  filter: Filter<T>,
  replacement: Partial<T>,
  readConfig: ReadConfig = {},
  replaceOptions: ReplaceOptions = {},
): Promise<UpdateResult | Document>
```

```typescript
await usersService.replaceOne(
  { _id: u._id },
  { fullName: fullNameToUpdate },
);
```

Replaces a single document within the collection based on the filter. **Doesn't validate schema or publish events**.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- replacement: `Partial<T>`;
- readConfig: [`ReadConfig`](#readconfig);
- replaceOptions: [`ReplaceOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/ReplaceOptions.html);

**Returns** `Promise<`[UpdateResult](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateResult.html) `|` [Document](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/Document.html)`>`.

### `atomic.updateOne`

```typescript
updateOne: (
  filter: Filter<T>,
  updateFilter: UpdateFilter<T>,
  readConfig: ReadConfig = {},
  updateOptions: UpdateOptions = {},
): Promise<UpdateResult>
```

```typescript
await userService.atomic.updateOne(
  { _id: u._id },
  { $set: { fullName: `${u.firstName} ${u.lastName}` } },
);
```

Updates a single document. **Doesn't validate schema or publish events**.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- updateFilter: [`UpdateFilter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#UpdateFilter);
- readConfig: [`ReadConfig`](#readconfig);
- updateOptions: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateOptions.html);

**Returns** `Promise<`[UpdateResult](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateResult.html)`>`.

### `atomic.updateMany`

```typescript
updateMany: (
  filter: Filter<T>,
  updateFilter: UpdateFilter<T>,
  readConfig: ReadConfig = {},
  updateOptions: UpdateOptions = {},
): Promise<Document | UpdateResult>
```

```typescript
await userService.atomic.updateMany(
  { firstName: { $exists: true }, lastName: { $exists: true } },
  { $set: { fullName: `${u.firstName} ${u.lastName}` } },
);
```

Updates all documents that match the specified filter. **Doesn't validate schema or publish events**.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- updateFilter: [`UpdateFilter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#UpdateFilter);
- readConfig: [`ReadConfig`](#readconfig);
- updateOptions: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateOptions.html);

**Returns** `Promise<`[UpdateResult](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/UpdateResult.html) `|` [Document](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/Document.html)`>`.

### `exists`

```typescript
exists(
  filter: Filter<T>,
  readConfig: ReadConfig = {},
  findOptions: FindOptions = {},
): Promise<boolean>
```

```typescript
const isUserExists = await userService.exists(
  { email: 'example@gmail.com' },
);
```

Returns ***true*** if document exists, otherwise ***false***.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- readConfig: [`ReadConfig`](#readconfig);
- findOptions: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/FindOptions.html);

**Returns** `Promise<boolean>`.

### `countDocuments`

```typescript
countDocuments(
  filter: Filter<T>,
  readConfig: ReadConfig = {},
  countDocumentOptions: CountDocumentsOptions = {},
): Promise<boolean>
```

```typescript
const documentsCount = await userService.countDocuments(
  { status: 'active' },
);
```

Returns amount of documents that matches the query.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- readConfig: [`ReadConfig`](#readconfig);
- countDocumentOptions: [`CountDocumentsOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/CountDocumentsOptions.html);

**Returns** `Promise<number>`.

### `distinct`

```typescript
distinct(
  key: string,
  filter: Filter<T>,
  readConfig: ReadConfig = {},
  distinctOptions: DistinctOptions = {},
): Promise<any[]>
```

```typescript
const statesList = await userService.distinct('states');
```

Returns distinct values for a specified field across a single collection or view and returns the results in an array.

**Parameters**
- key: `string`;
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#Filter);
- readConfig: [`ReadConfig`](#readconfig);
- distinctOptions: [`DistinctOptions`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#DistinctOptions);

**Returns** `Promise<any[]>`.

### `aggregate`

```typescript
aggregate: (
  pipeline: any[],
  options: AggregateOptions = {},
): Promise<any[]>
```

```typescript
const sortedActiveUsers = await userService.aggregate([
  { $match: { status: "active" } },
  { $sort: { firstName: -1, lastName: -1 } }
]);
```

Executes an aggregation framework pipeline and returns array with aggregation result of documents.

**Parameters**
- pipeline: `any[]`;
- options: [`AggregateOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/AggregateOptions.html);

**Returns** `Promise<any[]>`.

### `watch`

```typescript
watch: (
  pipeline: Document[] | undefined,
  options: ChangeStreamOptions = {},
): Promise<any>
```

```typescript
const watchCursor = userService.watch();
```

Creates a new Change Stream, watching for new changes and returns a cursor.

**Parameters**
- pipeline: `Document[] | undefined`;
- options: [`ChangeStreamOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/ChangeStreamOptions.html);

**Returns** `Promise<any>`.

### `drop`

```typescript
drop: (
  recreate: boolean = false,
): Promise<void>
```

```typescript
await userService.drop();
```

Removes a collection from the database. The method also removes any indexes associated with the dropped collection.

**Parameters**
- recreate: `boolean`;
  Should create collection after deletion.

**Returns** `Promise<void>`.

### `indexExists`

```typescript
indexExists: (
  indexes: string | string[],
  indexInformationOptions: IndexInformationOptions = {},
): Promise<boolean>
```

```typescript
const isIndexExists = await usersService.indexExists(index);
```

Checks if one or more indexes exist on the collection, fails on first non-existing index.

**Parameters**
- indexes: `string | string[]`;
- indexInformationOptions: [`IndexInformationOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/IndexInformationOptions.html);

**Returns** `Promise<string | void>`.

### `createIndex`

```typescript
createIndex: (
  indexSpec: IndexSpecification,
  options: CreateIndexesOptions = {},
): Promise<string | void>
```

```typescript
await usersService.createIndex({ fullName: 1 });
```

Creates collection index.

**Parameters**
- indexSpec: [`IndexSpecification`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#IndexSpecification);
- options: [`CreateIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/CreateIndexesOptions.html);

**Returns** `Promise<string | void>`.

### `createIndexes`

```typescript
createIndexes: (
  indexSpecs: IndexDescription[],
  options: CreateIndexesOptions = {},
): Promise<string[] | void>
```

```typescript
await usersService.createIndexes([
  { key: { fullName: 1 } },
  { key: { createdOn: 1 } },
]);
```

Creates one or more indexes on a collection.

**Parameters**
- indexSpecs: [`IndexDescription[]`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#IndexSpecification);
- options: [`CreateIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/CreateIndexesOptions.html);

**Returns** `Promise<string[] | void>`.

### `dropIndex`

```typescript
dropIndex: (
  indexName: string,
  options: DropIndexesOptions = {},
): Promise<void | Document>
```

```typescript
await userService.dropIndex({ firstName: 1, lastName: -1 });
```

Removes the specified index from a collection.

**Parameters**
- indexName: `string`;
- options: [`DropIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#DropIndexesOptions);

**Returns** `Promise<void | Document>`.

### `dropIndexes`

```typescript
dropIndexes: (
  options: DropIndexesOptions = {},
): Promise<void | Document>
```

Removes all but the `_id` index from a collection.

```typescript
await userService.dropIndexes();
```

**Parameters**
- options: [`DropIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.10/modules.html#DropIndexesOptions);

**Returns** `Promise<void | Document>`.

## Events API

### `eventBus.on`

```typescript
on: (
  eventName: string,
  handler: InMemoryEventHandler,
): void
```

```typescript
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

const collectionName = 'users';

eventBus.on(`${collectionName}.created`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    console.log('user created', user);
  } catch (err) {
    logger.error(`${USERS}.created handler error: ${err}`);
  }
});

eventBus.on(`${collectionName}.updated`, (data: InMemoryEvent<User>) => {});

eventBus.on(`${collectionName}.deleted`, (data: InMemoryEvent<User>) => {});
```

In-memory events handler that listens for a CUD events.

**Parameters**
- eventName: `string`;  
  Events names to listen.  
  Valid format: `${collectionName}.created`, `${collectionName}.updated`, `${collectionName}.deleted`.
- handler: [`InMemoryEventHandler`](#inmemoryeventhandler);

**Returns** `void`.

### `eventBus.once`

```typescript
once: (
  eventName: string,
  handler: InMemoryEventHandler,
): void
```

```typescript
eventBus.once(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    console.log('user updated', user);
  } catch (err) {
    logger.error(`${USERS}.updated handler error: ${err}`);
  }
});
```

In-memory events handler that listens for a CUD events. **It will be called only once**.

**Parameters**
- eventName: `string`;  
  Events names to listen.  
  Valid format: `${collectionName}.created`, `${collectionName}.updated`, `${collectionName}.deleted`.
- handler: [`InMemoryEventHandler`](#inmemoryeventhandler);

**Returns** `void`.

### `eventBus.onUpdated`

```typescript
onUpdated: (
  entity: string,
  properties: OnUpdatedProperties,
  handler: InMemoryEventHandler,
): void
```

```typescript
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

eventBus.onUpdated('users', ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
  try {
    await userService.atomic.updateOne(
      { _id: data.doc._id },
      { $set: { fullName: `${data.doc.firstName} ${data.doc.lastName}` } },
    );
  } catch (err) {
    console.log(`users onUpdated ['firstName', 'lastName'] handler error: ${err}`);
  }
});

eventBus.onUpdated('users', [{ fullName: 'John Wake', firstName: 'John' }, 'lastName'], () => {});

eventBus.onUpdated('users', ['oauth.google'], () => {});
```

In-memory events handler that listens for specific fields updates. It will be called when one of the provided `properties` updates.  

**Parameters**
- entity: `string`;  
  Collection name for events listening.
- properties: [`OnUpdatedProperties`](#onupdatedproperties);  
  Properties whose update will trigger the event.
- handler: [`InMemoryEventHandler`](#inmemoryeventhandler);

**Returns** `void`.

## Transactions API

### `withTransaction`

```typescript
withTransaction: <TRes = any>(
  transactionFn: (session: ClientSession) => Promise<TRes>,
): Promise<TRes>
```

Runs callbacks and automatically commits or rollbacks transaction.

```typescript
import db from 'db';

const { user, company } = await db.withTransaction(async (session) => {
  const createdUser = await usersService.insertOne({ fullName: 'Bahrimchuk' }, {}, { session });
  const createdCompany = await companyService.insertOne(
    { users: [createdUser._id] }, {},
    { session },
  );

  return { user: createdUser, company: createdCompany };
});
```

**Parameters**
- transactionFn: `(session: ClientSession) => Promise<TRes>`;  
  Function that accepts a client session and manages some business logic. Must return a `Promise`.

**Returns** `Promise<TRes>`.

## Options and Types

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

### `InMemoryEvent`
```typescript
type InMemoryEvent<T = any> = {
  doc: T,
  prevDoc?: T,
  name: string,
  createdOn: Date
};
```

### `InMemoryEventHandler`
```typescript
type InMemoryEventHandler = (evt: InMemoryEvent) => Promise<void> | void;
```

### `OnUpdatedProperties`
```typescript
type OnUpdatedProperties = Array<Record<string, unknown> | string>;
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
