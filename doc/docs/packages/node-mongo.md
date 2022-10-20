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
const updatedUserWithEvent = await usersService.updateOne(
  { _id: u._id },
  (doc) => ({ fullName: 'Updated fullname' }),
);

const updatedUser = await usersService.updateOne(
  { _id: u._id },
  (doc) => ({ fullName: 'Updated fullname' }),
  { publishEvents: false }
);
```

Updates a single document and returns it. Returns `null` if document was not found.

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

#### `service.cursor(query, options)`

```typescript
const usersCursor = await usersService.cursor(
  { status: 'active' },
);
```

Uses MongoDB find() method and returns cursor (pointer, and using this pointer we can access the document)

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<FindCursor<T>>`.

#### `service.exists(query, options)`

```typescript
const isUserExists = await usersService.exists(
  { email: 'example@gmail.com' },
);
```

Fetches the first document that matches the filter. Returns ***true*** if document exists, otherwise ***false***

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<boolean>`.

#### `service.countDocuments(query, options)`

```typescript
const documentsCount = await usersService.countDocuments(
  { status: 'active' },
);
```

Returns the count of documents that match the query for a collection.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`CountDocumentsOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/CountDocumentsOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<number>`.

#### `service.insertOne(object, options)`
***(:question: What returns? :question:)***

```typescript
const ? = await usersService.insertOne(
  {
    firstName: 'Peter',
    lastName: 'Parker',
  },
);
```

Inserts a single document into a collection.

**Parameters**
- object: `Partial<T>`;
- options: [`InsertOneOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/InsertOneOptions.html);

**Returns** `Promise<T>`.

#### `service.insertMany(objects, options)`
***(:question: What returns? :question:)***

```typescript
const ? = await usersService.insertMany(
  {
    firstName: 'Peter',
    lastName: 'Parker',
  },
  {
    firstName: 'Tony',
    lastName: 'Stark',
  },
);
```

Inserts multiple documents into a collection.

**Parameters**
- query: `Partial<T>`;
- options: [`BulkWriteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/BulkWriteOptions.html);

**Returns** `Promise<T[]>`.

#### `service.updateMany(query, updateFn, options)`

```typescript
const updatedUsers = await usersService.updateMany(
  { status: 'active' },
  (doc) => ({ isEmailVerified: true }),
);
```

Updates multiple documents and returns array with them. Returns empty array if documents was not found.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- updateFn: `(doc: T) => Partial<T>`;  
  Function that accepts current document and returns object containing fields to update.
- options: [`BulkWriteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/BulkWriteOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<T[]>`.

#### `service.deleteSoft(query, options)`

```typescript
const deletedUsers = await usersService.deleteSoft(
  { status: 'deactivated' },
);
```

Delete multiple documents that match the query. Returns array with deleted documents.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/UpdateOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<T[]>`.

#### `service.deleteOne(query, options)`

```typescript
const deletedUser = await usersService.deleteOne(
  { _id: u._id },
);
```

Delete the first document that matches the filter. Returns `null` if document was not found.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/DeleteOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<T | null>`.

#### `service.deleteMany(query, options)`

```typescript
const deletedUser = await usersService.deleteMany(
  { status: 'deactivated' },
);
```

Delete multiple documents that match the query. Returns array with deleted documents.

**Parameters**
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/DeleteOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<T[]>`.

#### `service.createIndex(indexSpec, options)`

```typescript
usersService.createIndex(
  { firstName: 1, lastName: -1 },
);
```

Creates indexes on collections.

**Parameters**
- indexSpec: [`IndexSpecification`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#IndexSpecification);
- options: [`CreateIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/CreateIndexesOptions.html);

**Returns** `Promise<string | void>`.

#### `service.createIndexes(indexSpecs, options)`

```typescript
usersService.createIndexes([
  { firstName: 1, lastName: -1 },
  { zip: 1 },
]);
```

Creates one or more indexes on a collection.

**Parameters**
- indexSpecs: [`IndexDescription[]`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#IndexSpecification);
- options: [`CreateIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/CreateIndexesOptions.html);

**Returns** `Promise<string[] | void>`.

#### `service.dropIndex(indexName, options)`

```typescript
usersService.dropIndex({ firstName: 1, lastName: -1 });
```

Drops or removes the specified index from a collection.

**Parameters**
- indexName: `string`;
- options: [`DropIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#DropIndexesOptions);

**Returns** `Promise<void | IDocument>`.

#### `service.dropIndexes(options)`

Drop all but the _id index from a collection:

```typescript
usersService.dropIndexes();
```

Drop specified indexes from a collection:

```typescript
usersService.dropIndexes([{ firstName: 1, lastName: -1 }, { zip: 1 }]);
```

**Parameters**
- options: [`DropIndexesOptions`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#DropIndexesOptions);

**Returns** `Promise<void | IDocument>`.

#### `service.watch(pipeline, options)`

```typescript
const watchCursor = usersService.watch();
```

Opens a change stream cursor on the collection.

**Parameters**
- pipeline: `IDocument[] | undefined`;
- options: [`ChangeStreamOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/ChangeStreamOptions.html);

**Returns** `Promise<any>`.

#### `service.distinct(key, query, options)`

```typescript
const stateList = usersService.distinct('states');
```

Finds the distinct values for a specified field across a single collection or view and returns the results in an array.

**Parameters**
- key: `string`;
- query: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOptions.html) & [`QueryDefaultsOptions`](#querydefaultsoptions);

**Returns** `Promise<any>`.

#### `service.aggregate(pipeline, options)`

```typescript
const sortedActiveUsers = usersService.aggregate([
  { $match: { status: "active" } },
  { $sort: { firstName: -1, lastName: -1 } }
]);
```

Calculates aggregate values for the data in a collection. Returns array with aggregation result documents.

**Parameters**
- pipeline: `any[]`;
- options: [`AggregateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/AggregateOptions.html);

**Returns** `Promise<any[]>`.

#### `service.drop(recreate = false)`

```typescript
usersService.drop();
```

Removes a collection from the database. The method also removes any indexes associated with the dropped collection.

**Parameters**
- recreate: `boolean`;

**Returns** `Promise<void>`.

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
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- update: [`UpdateFilter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#UpdateFilter) | `Partial<T>`,
- options: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/UpdateOptions.html);

**Returns**  `Promise<UpdateResult>`.

| Functionality       | Status  |
| ------------- | --------|
| [`addQueryDefaults`](#addquerydefaults) and [`validateQuery`](#validatequery) | ❌ |
| Schema validation |   ❌ |
| Updates `updatedOn` timestamp if `{ addUpdatedOnField: true }` option was passed when creating service |   ✅ |
| Fires `${collectionName}.updated` event | ❌ |

#### `service.atomic.findOne(filter, options)`

```typescript
const user = await userService.atomic.findOne(
 { _id: u._id },
);
```

Fetches the first document that matches the filter. Returns `null` if document was not found.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOptions.html);

**Returns**  `Promise<T | null>`.

#### `service.atomic.find(filter, options)`

```typescript
const userCursor = await userService.atomic.find(
 { status: 'active' },
);
```

Selects documents in a collection and returns a cursor to the selected documents.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOptions.html);

**Returns**  `Promise<FindCursor<T>>`.

#### `service.atomic.insertOne(doc, options)`

```typescript
await userService.atomic.insertOne(
 {
   firstName: 'Peter',
   lastName: 'Parker'
 },
);
```

Inserts a single document into a collection.

**Parameters**
- doc: `Partial<T>`;
- options: [`InsertOneOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/InsertOneOptions.html);

**Returns**  `Promise<T>`.

#### `service.atomic.insertMany(docs, options)`

```typescript
await userService.atomic.insertMany([
 {
   firstName: 'Peter',
   lastName: 'Parker',
 },
 {
   firstName: 'Tony',
   lastName: 'Stark',
 },
]);
```

Inserts multiple documents into a collection.

**Parameters**
- docs: `Partial<T>[]`;
- options: [`BulkWriteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/BulkWriteOptions.html);

**Returns**  `Promise<T[]>`.

#### `service.atomic.updateMany(filter, update, options)`

```typescript
await userService.atomic.updateMany(
 {
   firstName: { $exists: true },
   lastName: { $exists: true },
 },
 { $set: { fullName: `${u.firstName} ${u.lastName}` } },
);
```

Updates all documents that match the specified filter for a collection.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- update: [`UpdateFilter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#UpdateFilter) | `Partial<T>`,
- options: [`UpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/UpdateOptions.html);

**Returns**  `Promise<IDocument | UpdateResult>`.

#### `service.atomic.deleteOne(filter, options)`

```typescript
await userService.atomic.deleteOne({
  _id: u._id,
});
```

Removes a single document from a collection.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/DeleteOptions.html);

**Returns**  `Promise<DeleteResult>`.

#### `service.atomic.deleteMany(filter, options)`

```typescript
await userService.atomic.deleteMany({
  status: 'deactivated',
});
```

Removes all documents that match the filter from a collection.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`DeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/DeleteOptions.html);

**Returns**  `Promise<DeleteResult>`.

#### `service.atomic.replaceOne(filter, replacement, options)`

```typescript
await userService.atomic.replaceOne({
  firstName: 'Peter',
  lastName: 'Parker',
}, {
  fullName: 'Peter Parker',
});
```

Replaces a single document within the collection based on the filter.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- replacement: [`WithoutId<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#WithoutId);
- options: [`ReplaceOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/ReplaceOptions.html);

**Returns**  `Promise<UpdateResult | IDocument>`.

#### `service.atomic.bulkWrite(operations, options)`

```typescript
await userService.atomic.bulkWrite([
      { insertOne: { document: { _id: 1, firstName: 'Peter', lastName: 'Parker' } } },
      { deleteOne: { filter : { _id: 2 } } },
]);
```

Performs multiple write operations with controls for order of execution.

**Parameters**
- operations: [`AnyBulkWriteOperation<T>[]`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#AnyBulkWriteOperation);
- options: [`BulkWriteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/BulkWriteOptions.html);

**Returns**  `Promise<BulkWriteResult>`.

#### `service.atomic.findOneAndUpdate(filter, update, options)`

```typescript
await userService.atomic.findOneAndUpdate(
  { _id: u._id },
  { $set: { status: 'active' } },
);
```

Updates a single document based on the filter and sort criteria.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- update: [`UpdateFilter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#UpdateFilter),
- options: [`FindOneAndUpdateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOneAndUpdateOptions.html);

**Returns**  `Promise<ModifyResult<T>>`.

#### `service.atomic.findOneAndReplace(filter, replacement, options)`

```typescript
await userService.atomic.findOneAndReplace(
  { firstName: 'Peter', lastName: 'Parker' },
  { fullName: 'Peter Parker' },
);
```

Updates a single document based on the filter and sort criteria.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- replacement: [`WithoutId<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#WithoutId),
- options: [`FindOneAndReplaceOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOneAndReplaceOptions.html);

**Returns**  `Promise<ModifyResult<T>>`.

#### `service.atomic.findOneAndDelete(filter, options)`

```typescript
const deletedUser = await userService.atomic.findOneAndDelete({
  _id: u._id,
});
```

Deletes a single document based on the filter and sort criteria, returning the deleted document.

**Parameters**
- filter: [`Filter<T>`](https://mongodb.github.io/node-mongodb-native/4.7/modules.html#Filter);
- options: [`FindOneAndDeleteOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/FindOneAndDeleteOptions.html);

**Returns**  `Promise<ModifyResult<T>>`.

#### `service.atomic.aggregate(pipeline, options)`

```typescript
await userService.atomic.aggregate([
  { $match: { status: "active" } },
  { $sort: { firstName: -1, lastName: -1 } }
]);
```

Calculates aggregate values for the data in a collection.

**Parameters**
- pipeline: `any[]`;
- options: [`AggregateOptions`](https://mongodb.github.io/node-mongodb-native/4.7/interfaces/AggregateOptions.html);

**Returns**  `Promise<AggregationCursor<IDocument>>`.

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
