## v3.3.0 (2025-07-15)

- Added the ability to pass TypeScript generics to all service methods for improved type inference and type safety.
- Added `escapeRegExp` option to service methods, enabling automatic escaping of `$regex` filter values for safer and more predictable queries.
- Upgraded `mongodb` dependency to v6.17.0 and updated related dependencies (mocha, @types/mocha, zod, etc.).
- Fixed all known vulnerabilities.

## v3.2.0 (2023-10-10)

- Upgraded `mongodb` dependency from v4.10.0 to v6.1.0 (requires Node.js >=16.16.0).
- Cleaned up legacy MongoDB connection options.
- Improved typings and compatibility for bulk operations and index management.

## v3.1.2 (2022-12-01)

- Synchronized README.md with the documentation website for consistency and completeness.

## v3.1.1 (2022-10-24)

- Fixed: `atomic.updateOne` and `atomic.updateMany` now use `readConfig` for query validation, ensuring consistent handling of soft-delete and query options.

## v3.1.0 (2022-10-17)

- Refactored `Service` and `Database` classes for better type safety:
  - `IDocument` now extends MongoDB's `Document` and requires `_id: string`.
  - Many methods now use stricter generic constraints (`<T extends IDocument>`).
- Added support for custom schema validation via `schemaValidator` in `ServiceOptions`.
- Introduced new config types: `CreateConfig`, `ReadConfig`, `UpdateConfig`, `DeleteConfig` for more granular operation control.
- Improved transaction support: `database.withTransaction` now uses default transaction options and better error handling.
- Enhanced logging for event publishing and warnings in development mode.
- Internal: Cleaned up and unified method signatures, improved property type checks, and removed legacy/duplicate code.

## v3.0.4 (2022-09-07)

- Changed all date fields (`createdOn`, `updatedOn`, `deletedOn`) to use native `Date` objects instead of ISO strings.

## v3.0.3 (2022-08-03)

- `service.find()` options `page` and `perPage` are now optional; defaults are set internally if omitted.

## v3.0.2 (2022-06-24)

- `eventBus.onUpdated` now supports generics for improved type safety.
- `service.aggregate()` now returns an array of results directly.

## v3.0.1 (2022-06-21)

- In-memory event listeners now require an entity name (e.g., `onUpdated('users', ...)`).
- Added logging for published in-memory events.

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

- Update dependencies.

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

- Update dependencies.
- Fix required version of the Node.js.

### Breaking Changes

- Now `update` function will work via [set](https://docs.mongodb.com/manual/reference/operator/update/set/) operator. It means the new doc will be the result of merge of the old doc and the provided one.

## v1.0.0 (2018-05-23)

- Update dependencies.
- Add tests.
- Fix required version of the Node.js.

### Breaking Changes

- Now, by default, we do not add the fields `createdOn` and` updatedOn` automatically to the model. If you want to save the current behavior, add the appropriate `addCreatedOnField` and` addUpdatedOnField` options to the service definitions.

## v0.3.1 (2017-12-16)

- Stop using deprecated method `ensureIndex` of the `monk`.

## v0.3.0 (2017-10-24)

- Add ability to create custom methods for service and query service.
- Add tests.

## v0.2.0 (2017-10-12)

- Add support of the [joi](https://github.com/hapijs/joi) for validating data schema.
- Add tests for validating of the schema.
