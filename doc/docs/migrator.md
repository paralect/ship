---
sidebar_position: 4
---

# Migrator

As the application grows your database schema also will evolve.
The problem is pretty common. When you add some feature that influences a database schema(adding, removing, or replacing some fields) you will have to update already existing documents to the latest schema version. Otherwise working with old documents will be impossible, because you will struggle with errors when you will rely on an updated field in your code. So you will run migrations where you will resolve code and schema mismatching.

Migrator is a service that runs MongoDB migrations, handles versioning, and keeps logs for every migration.
It performs changes/migrations to current database data, to match new schema or new requirements.
Those changes are stored in the `migrator/migrations` folder.

:::tip
Any changes to the project's database are very sensitive and should be consistent. But also frequently migrations have operations that can take a lot of time to apply.
It can create downtime for both database and API services. So to reduce these effects - Migrator is running as a separate service.
:::
## How it works in the Ship

Every time Migrator is started, it is getting current successful migration version from the `migrationVersion` collection.
And tries to apply every migration above this version in a sequence.
Every `migration` from `migrator/migrations` will be called one by one, and every time it will be logged to the `migrationLog` collection either with:
1. `completed` status with updating the current version
2. `failed` status *without* updating the current version

> :warning: **Warning:** Sequence of migrations will stop on `failed` migration and won't apply versions above it.

`migrationVersion` will be updated only if migration was applied without any errors. So at the end of the Migrator's execution, it stores the last successful version.

## How to add a new migration.

1. To add new migration - add new `#.ts` file inside еру `migrator/migrations` folder (with the name of the next version, that is higher than the current version)ю
2. Create new `Migration` with the `#.ts` migration number and description.

### Example

We already have migration `1.ts`, so let's add another one. We have a collection of `users`, but we need to assign some of them special rights within our app. Let's add a new boolean field `isAdmin` to the user schema.

```typescript title=user.schema.ts
const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  role: z.string(),
  isAdmin: z.boolean().default(false)
});
```

After adding this field to the schema, every new user will automatically have `isAdmin` upon creation with `true` or `false`.
But old users don't have the field `isAdmin` at all. So let's add it.

```typescript title=migrator/migrations/2.ts
const migration = new Migration(2, 'Add isAdmin field to users');

migration.migrate = async () => {
  const userIds = await userService.distinct('_id', {
    role: 'admin',
  });

  const updateFn = (userId: string) => userService.atomic.updateOne(
    { _id: userId },
    { $set: { isAdmin: true } },
  );

  await promiseUtil.promiseLimit(userIds, 50, updateFn);
};

export default migration;
```

> :warning: **Warning:** Don't use methods that emit **[events](packages/node-mongo#reactivity)** during the operation. Instead, use atomic operations like
**[atomic.updateOne](packages/node-mongo#atomicupdateone)** or **[updateOne](packages/node-mongo#updateconfig)** with `publishEvents: false`

## Promise Limit
Every migration should use `promiseLimit` to perform changes to the collections, to avoid insufficient resources to complete operations:
```typescript
promiseLimit(documents: unknown[], limit: number, operator: (doc: any) => any)
```

## How it deploys and runs

The main idea behind the ship's Migrator is to run it **before** **[API](api/overview)** and **[Scheduler](scheduler)** deployment.
Therefore, if any migration fails, then the API or Scheduler updates will not be applied. And they will always work with an up-to-date schema.

More on **[Kubernetes](deployment/kubernetes/overview#deployment-flow)** and **[DO Apps](deployment/digital-ocean-apps#set-up-migrator-and-scheduleroptional)** deployment.

## How to re-run failed migration

Migrator always run migrations only above already applied ones.

So to re-run failed one, you simply start to migrate the process again.

For development:
```
npm run migrate-dev
```

For production:
```
npm run migrate
```
## How to check failed migration logs

First, you can check `migrationLog` and find your migration with the status `failed`. It contains the `error` and `errorStack` fields.

For Kubernetes deployment, you can check the log inside its container by:

```
kubectl get pods -A
```
which is used to check `migrator_container_name` and `namespace`, and then:

```
kubectl log -f migrator_container_name -n namespace
```
