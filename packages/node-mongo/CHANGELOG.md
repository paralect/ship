## v3.0.0 (2022-03-28)

The release includes a lot of changes to make sure that the package is compatible with the latest MongoDB version.
Most notable changes:
- Rewritten in typescript
- Removed [monk](https://github.com/Automattic/monk) dependency.
- Added [mongodb native Node.JS sdk](https://www.mongodb.com/docs/drivers/node/current/) as dependency. 
- Added support for transactional events using [transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html)
- Introduced shared in-memory events bus. It should be used to listen for CUD updates.

## v2.1.0 (2020-10-15)

### Features

#### Manager

[createService](API.md#createservice)
- Add [emitter](API.md#createservice) option.

## v2.0.0 (2020-09-29)

* Update dependencies.

### Breaking Changes

#### [Manager](API.md#manager)

[createQueryService](API.md#createqueryservice)
- Rename `validateSchema` option to `validate`.
- Change `addCreatedOnField` default to `true`.
- Change `addUpdatedOnField` default to `true`.

[createService](API.md#createservice)
- Rename `validateSchema` option to `validate`.
- Change `addCreatedOnField` default to `true`.
- Change `addUpdatedOnField` default to `true`.

#### [Query Service](API.md#query-service)
- Remove `generateId` method.
- Remove `expectDocument` method.

#### [Service](API.md#service)
- Remove `update` method. Use [updateOne](API.md#updateone) or [updateMany](API.md#updatemany).
- Remove `ensureIndex`. Use [atomic.createIndex](API.md#atomiccreateindex).
- Remove `createOrUpdate`. Use [create](API.md#create) or [updateOne](API.md#updateone) or [updateMany](API.md#updatemany).
- Remove `findOneAndUpdate`. Use [findOne](API.md#findone) and [updateOne](API.md#updateone).

### Features

#### Manager

[createQueryService](API.md#createqueryservice)
- Add `useStringId` option.

[createService](API.md#createservice)
- Add `useStringId` option.

#### [Query Service](API.md#query-service)
- Add more monk's methods. [See full list](API.md#query-service)

#### [Service](API.md#service)
- Add [generateId](API.md#generateid) method.
- Add [updateOne](API.md#updateone) method.
- Add [updateMany](API.md#updatemany) method.
- Add [performTransaction](API.md#performtransaction) method.
- Add more monk's methods in `atomic` namespace. [See full list](API.md#service)


## v1.1.0 (2019-06-25)

* Update dependencies.
* Fix required version of the Node.js.

### Breaking Changes

* Now `update` function will work via [set](https://docs.mongodb.com/manual/reference/operator/update/set/) operator. It means the new doc will be the result of merge of the old doc and the provided one.

## v1.0.0 (2018-05-23)

* Update dependencies.
* Add tests.
* Fix required version of the Node.js.

### Breaking Changes

* Now, by default, we do not add the fields `createdOn` and` updatedOn` automatically to the model. If you want to save the current behavior, add the appropriate `addCreatedOnField` and` addUpdatedOnField` options to the service definitions.

## v0.3.1 (2017-12-16)

* Stop using deprecated method `ensureIndex` of the `monk`.

## v0.3.0 (2017-10-24)

* Add ability to create custom methods for service and query service.
* Add tests.

## v0.2.0 (2017-10-12)

* Add support of the [joi](https://github.com/hapijs/joi) for validating data schema.
* Add tests for validating of the schema.
