---
sidebar_position: 4
---

# Migrator

Migrator is a service that runs MongoDB migrations, handling versioning and keeping logs for every migration.
It performs changes/migrations to current database data, in order to match new schema or new requirements.
Those changes are stored in `migrator/migrations` folder.

:::tip
Any changes to the project's database are very sensitive and should be consistent. But also frequently migrations have operations that can take a lot of time to apply.
It can create downtime for both database and API services. So to reduce these effects - Migrator is running as a separate service.
:::
## How it works in the Ship

Every time Migrator is started, it is getting current successful migration version from `migrationVersion` collection.
And tries to apply every migration above this version in a sequence.
Every `migration` from `migrator/migrations` will be called one by one, and every time it will be logged to `migrationLog` either with:
1. `completed` status with updating the current version
2. `failed` status *without* updating the current version

> :warning: **Warning:** Sequence of migrations will stop on `failed` migration and won't apply versions above it

`migrationVersion` will update only if migration was applied without any errors.
So at the end of the Migrator's execution, it stores the last successful version.

## How to add a new migration.

1. To add new migration - add new `#.ts` file `migrator/migrations` (with a name of the next version, that is higher than the current version)
2. Create new `Migration` with declared `migrate`

> :memo: Example

At the start, we already have migration `1.ts`. Let's add another one.
We already have a collection `users`, but we want to assign some of them special rights within our app.

So we want to add a new field to every user `isAdmin` which is a boolean.
After adding this field to the schema, every new user will automatically have `isAdmin` upon creation with `true` or `false`.

But old users don't have the field `isAdmin` at all. So let's add it:

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

> :warning: **Warning:** Don't use methods that emit **[events](packages/node-mongo#reactivity)** about the operation. Instead, use atomic operations like
**[atomic.updateOne](packages/node-mongo#atomicupdateone)** or **[updateOne](packages/node-mongo#updateconfig)** with `publishEvents: false`

## Promise Limit
Every migration should use `promiseLimit` to perform changes to the collections, to avoid insufficient resources to complete operations:
```typescript
promiseLimit(documents: unknown[], limit: number, operator: (doc: any) => any)
```

## How it deploys and runs

The main idea behind the ship's Migrator is to run it **before** **[API](api/overview)** and **[Scheduler](scheduler)** deployment.
Therefore, if any migration fails, then the API or scheduler updates will not be applied. And they will always work with an up-to-date scheme.

More on **[Kubernetes](deployment/kubernetes/overview)** and **[DO Apps](deployment/digital-ocean-apps#set-up-migrator-and-scheduleroptional)** deployment.

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
## How to check failed migration logs in k8s

First, you can check `migrationLog` and find your migration with the status `failed`. It contains `error` and `errorStack` fields.

Second, after the Migrator's job you can check the log inside its container by:

```
kubectl get pods -A
```
which is used to check `migrator_container_name` and `namespace`, and then:


```
kubectl log -f migrator_container_name -n namespace
```
