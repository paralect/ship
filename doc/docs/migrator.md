---
sidebar_position: 4
---

# Migrator

Migrator is a service which runs MongoDB migrations, handling versioning and keeping logs for every migration.
It performs changes/migrations to current database data, in order to match new schema or new requirements.
Those changes is stored in `migrator/migrations` folder.

:::tip
Any changes to project's database are very sensitive, and should be consistent. But also frequently migrations have operations that can take a lot of time to apply.
It can create a downtime for both database and api services. So to reduce this effects - Migrator is running as a separate service.
:::
## How it works in ship

Every time Migrator is started, it is getting current successful migration version from `migrationVersion` collection.
And tries to apply every migration above this version in a sequence.
Every `migration` from `migrator/migrations` will be called one by one, and every time it will be logged to `migrationLog` either with:
1. `completed` status with updating current version
2. `failed` status *without* updating current version

> :warning: **Warning:** Sequence of migrations will stop on `failed` migration and won't apply versions above it

`migrationVersion` will update only if migration was applied without any errors.
So at the end of Migrator's execution, it stores last successful version.

## How to add a new migration.

1. To add new migration - add new `#.ts` file `migrator/migrations` (with a name of next version, that is higher than current version)
2. Create new `Migration` with declared `migrate`

> :memo: Example

At the start we already have migration `1.ts`. Lets add another one.
We already have a collection `users`, but we want to assign to some of them special rights within our app.

So we want to add new field to every user `isAdmin` which is boolean.
After adding this field to the schema, every new user will automatically has `isAdmin` upon creation with `true` or `false`.

But old users don't have field `isAdmin` at all. So lets add it:

```migrator/migrations/2.ts```
```typescript
const migration = new Migration(2, 'Add isAdmin field to users');

migration.migrate = async () => {
  const userIds = await userService.distinct('_id', {
    isAdmin: undefined,
  });

  const updateFn = (userId: string) => userService.atomic.updateOne(
    { _id: userId },
    { $set: { isAdmin: false } },
  );

  await promiseUtil.promiseLimit(userIds, 50, updateFn);
};

export default migration;
```

> :warning: **Warning:** Don't use mongodb methods that emit **[events](packages/node-mongo#reactivity)** about the operation. Instead use atomic operations like
**[atomic.updateOne](packages/node-mongo#atomicupdateone)** or **[updateOne](packages/node-mongo#updateconfig)** with `publishEvents: false`

## Promise Limit
Every migration should use `promiseLimit` to perform changes to the collections, to avoid insufficient resources to complete operations:
```typescript
promiseLimit(documents: unknown[], limit: number, operator: (doc: any) => any)
```

## How it deploys and runs

Main idea behind ship's Migrator is to run it **before** **[API](api/overview)** and **[Scheduler](scheduler)** deployment.
Therefore, if any migration fails, then the API or scheduler updates will not be applied. And they will always work with an up-to-date scheme.

More on **[Kubernetes](deployment/kubernetes/overview)** and **[DO Apps](deployment/digital-ocean-apps#set-up-migrator-and-scheduleroptional)** deployment.

## How to re-run failed migration

Migrator always run migrations only above already applied ones.

So in order to re-run failed one, you simply start migrate process again.

For development:
```
npm run migrate-dev
```

For production:
```
npm run migrate
```
## How to check failed migration logs in k8s

First you can check `migrationLog` and find your migration with status `failed`. It contains `error` and `errorStack` fields.

Second after migrator's job you can check log inside it's container by:

```
kubectl get pods -A
```
which is used for check `migrator_container_name` and `namespace`, and then:


```
kubectl log -f migrator_container_name -n namespace
```
