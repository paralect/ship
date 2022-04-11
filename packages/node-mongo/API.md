# 2.0.0 API Reference

- [Node Mongo](#node-mongo)
  - [connect](#connect)
- [Manager](#manager)
  - [createService](#createservice)
  - [setServiceMethod](#setservicemethod)
  - [createQueryService](#createqueryservice)
  - [setQueryServiceMethod](#setqueryservicemethod)
- [Query Service](#query-service)
  - [name](#name)
  - [exists](#exists)
  - [find](#find)
  - [findOne](#findone)
  - [aggregate](#aggregate)
  - [count](#count)
  - [distinct](#distinct)
  - [geoHaystackSearch](#geohaystacksearch)
  - [indexes](#indexes)
  - [mapReduce](#mapreduce)
  - [stats](#stats)
- [Service](#service)
  - [on](#on)
  - [once](#once)
  - [onPropertiesUpdated](#onpropertiesupdated)
  - [generateId](#generateid)
  - [create](#create)
  - [updateOne](#updateone)
  - [updateMany](#updatemany)
  - [remove](#remove)
  - [performTransaction](#performtransaction)
  - [atomic.bulkWrite](#atomicbulkwrite)
  - [atomic.createIndex](#atomiccreateindex)
  - [atomic.drop](#atomicdrop)
  - [atomic.dropIndex](#atomicdropindex)
  - [atomic.dropIndexes](#atomicdropindexes)
  - [atomic.findOneAndDelete](#atomicfindoneanddelete)
  - [atomic.findOneAndUpdate](#atomicfindoneandupdate)
  - [atomic.insert](#atomicinsert)
  - [atomic.remove](#atomicremove)
  - [atomic.update](#atomicupdate)

## Node Mongo

### connect

Connect to MongoDB.

#### Arguments:
- `connectionString: String` - [connection string](https://docs.mongodb.com/manual/reference/connection-string/).
- `connectionSettings: Object` - optional [connection settings](http://mongodb.github.io/node-mongodb-native/2.1/reference/connecting/connection-settings/).

#### Returns:
A [Manager](#manager) instance.

#### Example:
```js
const db = require('node-mongo').connect(
  'mongodb://localhost:27017/home',
  { poolSize: 10 },
);
```

## Manager

### Methods:
- [createQueryService](#createqueryservice)
- [setQueryServiceMethod](#setqueryservicemethod)
- [createService](#createservice)
- [setServiceMethod](#setservicemethod)

### createQueryService

Create and return [Query Service](#query-service) instance.

#### Arguments:
- `collectionName: String` - name of the MongoDB collection.

#### Returns:
A [Query Service](#query-service) instance.

#### Example:

```js
const usersQueryService = db.createQueryService('users');
```

### setQueryServiceMethod

Add custom method for [Query Service](#query-service).

#### Arguments:
- `name: String` - name of the method, that will be used to call method.
- `method: (QueryService, ...args) => any` - custom function in which we can manipulate the collection. The custom function takes the service itself as the first parameter, and the remaining parameters are the parameters that are passed when this custom function is called.

#### Example:
```js
const db = require('node-mongo').connect(connectionString);

db.setQueryServiceMethod('findByName', (service, name, options) => {
  return service.findOne({ name }, { collation: 'en', ...options });
});

const userService = db.createQueryService('users');

const user = userService.findByName('Bob', { projection: { name: 1, age: 1 } });
```

### createService

Create and return [Service](#service) instance.

#### Arguments:
- `collectionName: String` - the name of the collection with which the service will work.
- `options: Object` - optional object with options of the service.
  - `addCreatedOnField: Boolean = true` - if `true`, we add the `createdOn` field for each document to be created using the [create](#create) method.
  - `addUpdatedOnField: Boolean = true` - if `true`, we add and update the `updatedOn` field for each document to be updated using [updateOne](#updateone) or [updateMany](#updatemany) methods.
  - `useStringId: Boolean = true` - if `true`, we replace `_id` ([ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) by default) with a string that is generated using the [generateId](#generateid) method.
  - `validate: (doc) => Promise<{ error, value }>` - optional function that accepts a collection document and returns the result of the validation of this document. Result should be an object with `value` and `error` fields. The error will be thrown if `error` is a truthy value.
  - `emitter: Emitter = new EventEmitter()` - optional instance of Emitter, which partially implements the [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) interface ([emit](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args), [on](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener), [once](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener) methods are enough).

#### Returns:
A [Service](#service) instance.

#### Example:

`user.schema.js`
```js
const Joi = require('Joi');

const userSchema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  name: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
});

// you can use validate method from Joi
module.validate = (obj) => userSchema.validate(obj);

// or it could be your custom function
module.validate = (obj) => {
  if (!obj.name) {
    return {
      value: obj,
      error: {
        details: [{ message: 'Name is required' }],
      },
    };
  }
  return { value: obj };
};
```

`user.service.js`
```js
const { validate } = require('./user.schema');

const userService = db.createService('users', {
  useStringId: false,
  validate,
});
```

### setServiceMethod

Add custom method for [Service](#service).

#### Arguments:
- `name: String` - name of the method, that will be used to call method.
- `method: (Service, ...args) => any` - custom function in which we can manipulate the collection. The custom function takes the service itself as the first parameter, and the remaining parameters are the parameters that are passed when this custom function is called.

#### Example:
```js
const db = require('node-mongo').connect(connectionString);

db.setServiceMethod('createByName', (service, name) => {
  return service.create({ name });
});

const userService = db.createService('users');

const user = userService.createByName('Bob');
```

## Query Service

Query Service allows you to make requests to the database to get needed data, but this service not allow to modify data in the database.

### Properties
  - [name](#name)

### Methods
  - [exists](#exists)
  - [find](#find)
  - [findOne](#findone)
  - [aggregate](#aggregate)
  - [count](#count)
  - [distinct](#distinct)
  - [geoHaystackSearch](#geohaystacksearch)
  - [indexes](#indexes)
  - [mapReduce](#mapreduce)
  - [stats](#stats)

### name

Name of the collection for which service was created.

#### Example:
```js
const db = require('node-mongo').connect(connectionString);

const userQueryService = db.createQueryService('users');

console.log(userQueryService.name); // users
```

### exists

Gets existence of the documents matching the filter. Under the hood, [count](#count) method is used.

#### Arguments:
- `query: Object` - query for [count](#count) operation.
- `options: Object` - optional settings for [count](#count) operation.

#### Returns:
Boolean value.

#### Example:
```js
const userService = db.createService('users');
const userExists = await userService.exists({ name: 'Bob' });
```

### find

Gets documents matching the filter. Under the hood, monk's [find](https://automattic.github.io/monk/docs/collection/find.html) method is used.

#### Arguments:
- `query: Object` - object, according to which we receive documents.
- `options: Object` - optional object with options for query.
  - `perPage: Number = 100` - optional number of returned documents.
  - `page: Number = 0` - optional page number with results.
  - `rawCursor: Boolean` - optional parameter to get the raw [mongo cursor](http://mongodb.github.io/node-mongodb-native/3.2/api/Cursor.html). You can find more usage examples in [monk docs](https://automattic.github.io/monk/docs/collection/find.html).
  - [...default mongo options](https://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#find)

#### Returns:
An object with following fields:
  - `results: Object[]` - array of documents.

Additional fields will be added, if the `page` option exists and is greater than zero:
  - `pagesCount: Number` - total number of pages.
  - `count: Number` - total number of documents that satisfy the condition.

#### Example:
```js
const db = require('node-mongo').connect(connectionString);

const userQueryService = db.createQueryService('users');

const { results, pagesCount, count } = await userQueryService.find(
  { name: 'Bob' },
  { page: 1, perPage: 30 },
);
```

### findOne

Get one document that satisfies the specified condition. Under the hood, [find](#find) method is used.

#### Arguments:
- `query: Object` - query for [find](#find) operation.
- `options: Object` - optional settings for [find](#find) operation.

#### Returns:
A document or `null`. If several documents satisfy the condition, then we throw an error.

#### Example:
```js
const userService = db.createService('users');
try {
  const user = await userService.findOne({ name: 'Bob' });
} catch (error) {
  console.error('Several users were found');
}
```

### aggregate

Calculates aggregate values for the data in a collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/aggregate.html). Under the hood, native [aggregate](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#aggregate) method is used.

### count

Gets the number of documents matching the filter.

[Monk's method](https://automattic.github.io/monk/docs/collection/count.html). Under the hood, native [countDocuments](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#countDocuments) method is used.

### distinct

The distinct command returns a list of distinct values for the given key across a collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/distinct.html). Under the hood, native [distinct](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#distinct) method is used.

### geoHaystackSearch

Execute a geo search using a geo haystack index on a collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/geoHaystackSearch.html). Under the hood, native [geoHaystackSearch](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#geoHaystackSearch) method is used.

### indexes

Returns an array that holds a list of documents that identify and describe the existing indexes on the collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/indexes.html). Under the hood, native [indexes](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#indexes) method is used.

### mapReduce

Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/mapReduce.html). Under the hood, native [mapReduce](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#mapReduce) method is used.

### stats

Get all the collection statistics.

[Monk's method](https://automattic.github.io/monk/docs/collection/stats.html). Under the hood, native [stats](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#stats) method is used.

## Service

Service extends [Query Service](#query-service), therefore instance of this service has all methods of the [Query Service](#query-service).

Service emits events that you can subscribe to. **Please note that only the methods mentioned below can emit events**.

#### Events:
  - `created` — emits when you create a document with [create](#create) method.
  - `updated` — emits when you create a document with [updateOne](#updateone) or [updateMany](#updatemany) methods.
  - `removed` — emits when you remove a document with [remove](#remove) method.

Methods in the `atomic` namespace are ordinary monk's methods. They don't emit any events and don't validate data.

#### Methods:
- [on](#on)
- [once](#once)
- [onPropertiesUpdated](#onpropertiesupdated)
- [generateId](#generateid)
- [create](#create)
- [updateOne](#updateone)
- [updateMany](#updatemany)
- [remove](#remove)
- [performTransaction](#performtransaction)
- [atomic.bulkWrite](#atomicbulkwrite)
- [atomic.createIndex](#atomiccreateindex)
- [atomic.drop](#atomicdrop)
- [atomic.dropIndex](#atomicdropindex)
- [atomic.dropIndexes](#atomicdropindexes)
- [atomic.findOneAndDelete](#atomicfindoneanddelete)
- [atomic.findOneAndUpdate](#atomicfindoneandupdate)
- [atomic.insert](#atomicinsert)
- [atomic.remove](#atomicremove)
- [atomic.update](#atomicupdate)

### on

Subscribes to database change events.

#### Arguments:
- `eventName: String` - name of the database [event](#events).
- `handler: ({ doc, prevDoc }) => any` - event handler.

#### Returns:
A reference to the `EventEmitter`.

#### Example:
```js
const userService = db.createService('users');
userService.on('updated', ({ doc, prevDoc }) => {
});
```

### once

Subscribe to database change events only once. The first time evenName is triggered listener handler is removed and then invoked.

#### Arguments:
- `eventName: String` - name of the database [event](#events).
- `handler: ({ doc, prevDoc }) => any` - event handler.

#### Returns:
Returns a reference to the `EventEmitter`.

#### Example:
```js
const userService = db.createService('users');
userService.once('updated', ({ doc, prevDoc }) => {
});
```

### onPropertiesUpdated

Deep compare doc and prevDoc from `updated` event. When something changed - executes callback.

#### Arguments:
- `properties: String[] | Object` - properties to compare
- `handler: ({ doc, prevDoc }) => any` - event handler.

#### Returns:
A reference to the `EventEmitter`.

#### Example:
```js
const userService = db.createService('users');

// Callback executed only if user lastName or firstName are different in current or updated document
userService.onPropertiesUpdated(
  ['user.firstName', 'user.lastName'],
  ({ doc, prevDoc }) => {},
);

// Callback executed only if user first name changes to `Bob`
userService.onPropertiesUpdated(
  { 'user.firstName': 'Bob' },
  ({ doc, prevDoc }) => {},
);
```

### generateId

Get ID for mongoDB documents.

#### Returns:
ID string.

#### Example:
```js
const userService = db.createService('users');
const id = userService.generateId();
```

### create

Inserts one object or array of the objects to the database. Validates the documents before creation if service was created with `validate` option. Adds `createdOn` field to the document. Publishes the `created` event.

#### Arguments:
- `documents: Object | Object[]` - object or array of objects to create.

#### Returns:
Object or array of created objects.

#### Example:
```js
const userService = db.createService('users');
const users = await userService.create([
  { name: 'Bob' },
  { name: 'Alice' },
]);
```

### updateOne

Updates entity found by query in the database. Validates the document before save if service was created with `validate` option. Updates `updatedOn` field in the document. Publishes the `updated` event. **Throws out an error if more than one document is found or if no document is found**.

#### Arguments:
- `query: Object` - query for [findOne](#findone) operation.
- `updateFn: (doc) => doc` - update function that recieves old document and should return updated one.
- `options: Object` - optional options for [findOne](#findone) operation.

#### Returns:
Updated document.

#### Example:
```js
const userService = db.createService('users');
try {
  const updatedUser = await userService.updateOne(
    { _id: '1'},
    (doc) => ({ ...name, name: 'Alex' }),
  );
} catch (error) {
  console.error(error.message);
}
```

### updateMany

Updates entity found by query in the database. Validates the documents before save if service was created with `validate` option. Updates `updatedOn` field in the every the document. Publishes the `updated` event for every document.

#### Arguments:
- `query: Object` - query for [find](#find) operation.
- `updateFn: (doc) => doc` - update function that recieves old document and should return updated one.
- `options: Object` - optional options for [find](#find) operation.

#### Returns:
Array of updated documents.

#### Example:
```js
const userService = db.createService('users');
const updatedUsers = await userService.updateMany(
  { age: '27' },
  (doc) => ({ ...name, alive: false }),
);
```

### remove

Removes documents found by query. Publishes the `removed` event for every document.

#### Arguments:
  - `query: Object` - query for [find](#find) operation.
  - `options: Object` - optional options for [find](#find) operation.

#### Returns:
Array of removed documents.

#### Example:
```js
const userService = db.createService('users');
const removedUsers = await userService.remove({ name: 'Alex' });
```

### performTransaction

Starts a new session, performs transaction and ends this session.

#### Arguments:
- `transactionFn: (Session) => Promise<any>` - function to be performed within a transaction. **It must return Promise**.
- `options: Object` - optional settings for [startSession](http://mongodb.github.io/node-mongodb-native/3.2/api/MongoClient.html#startSession) operation.

#### Returns:
Resulting Promise of operations run within transaction.

#### Example:
```js
const userService = db.createService('users');
const teamService = db.createService('teams');

await userService.performTransaction(async (session) => {
  await userService.create({}, { session });
  await teamService.create({}, { session });
});
```

### atomic.bulkWrite

Perform a bulkWrite operation without a fluent API.

[Monk's method](https://automattic.github.io/monk/docs/collection/bulkWrite.html). Under the hood, native [bulkWrite](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#bulkWrite) method is used.

### atomic.createIndex

Creates an index on the db and collection (will not create if already exists).

[Monk's method](https://automattic.github.io/monk/docs/collection/createIndex.html). Under the hood, native [createIndex](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#createIndex) method is used.

### atomic.drop

Drop the collection from the database, removing it permanently. New accesses will create a new collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/drop.html). Under the hood, native [drop](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#drop) method is used.

### atomic.dropIndex

Drops indexes from this collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/dropIndex.html). Under the hood, native [dropIndex](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#dropIndex) method is used.

### atomic.dropIndexes

Drops all indexes from this collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/dropIndexes.html). Under the hood, native [dropIndexes](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#dropIndexes) method is used.

### atomic.findOneAndDelete

Find a document and delete it in one atomic operation.

[Monk's method](https://automattic.github.io/monk/docs/collection/findOneAndDelete.html). Under the hood, native [findOneAndDelete](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOneAndDelete) method is used.

### atomic.findOneAndUpdate

Find a document and update it in one atomic operation.

[Monk's method](https://automattic.github.io/monk/docs/collection/findOneAndUpdate.html). Under the hood, native [findOneAndUpdate](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOneAndUpdate) method is used.

### atomic.insert

Inserts a single document or a an array of documents into MongoDB.

[Monk's method](https://automattic.github.io/monk/docs/collection/insert.html). Under the hood, native [insertOne](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertOne) and [insertMany](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertMany) methods are used.

### atomic.remove

Remove documents.

[Monk's method](https://automattic.github.io/monk/docs/collection/remove.html). Under the hood, native [deleteOne](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#deleteOne) and [deleteMany](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#deleteMany) methods are used.

### atomic.update

Modifies an existing document or documents in a collection.

[Monk's method](https://automattic.github.io/monk/docs/collection/update.html). Under the hood, native [updateOne](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#updateOne) and [updateMany](http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#updateMany) methods are used.
