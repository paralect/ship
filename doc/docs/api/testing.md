---
sidebar_position: 7
---

# Testing

## Overview

**Tests** are functions that make it possible to check the correctness of the behavior of the developed functionality.

In Ship tests are set up with **Jest** testing framework, `ts-jest` preset for possibility to test Typescript applications. For testing Mongodb functionality with Jest MongoDB In-Memory Server and `jest-mongodb` preset are used. Every `MongoMemoryServer` instance creates and starts a fresh MongoDB server on some free port. MongoDB In-Memory Server allows us to connect to the MongoDB server and run integration tests isolated from each other.

Tests should be in the `tests` directory specified for each resource from `resources` folder. Test files also should include resource name and testing entity e.x. `user.service.spec.ts`.

You can use `npm test` command to run all tests and linter checks or `npm run test:unit` command to run only Jest tests.

## Examples

```typescript
import { Database } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from 'resources/user/user.types';
import userSchema from 'resources/user/user.schema';

const database = new Database(process.env.MONGO_URL as string);

const userService = database.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

describe('User service', () => {
  beforeAll(async () => {
    await database.connect();
  });

  it('should insert doc to collection', async () => {
    const mockUser = { _id: '12q', name: 'John' };
    
    await userService.insertOne(mockUser);

    const insertedUser = await userService.findOne({ _id: mockUser._id });

    expect(insertedUser).toEqual(mockUser);
  });

  afterAll(async () => {
    await database.close();
  });
});
```
