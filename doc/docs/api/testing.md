---
sidebar_position: 7
---

# Testing

## Overview

In Ship testing settled through [Jest](https://jestjs.io/) framework and [MongoDB memory server](https://github.com/nodkz/mongodb-memory-server#available-options) with possibility running them in CI/CD pipeline. MongoDB's memory server allows connecting to the MongoDB server and running integration tests isolated.

Tests should be placed in the `tests` directory specified for each resource from the `resources` folder and have next naming format `user.service.spec.ts`.

```markdown title=my-app/apps/api/src/resources/user/tests/user.service.spec.ts
resources/
  user/
    tests/
      user.service.spec.ts
```

Run tests and linter.

```shell
npm run test
```

Run only tests.

```shell
npm run test:unit
```

## Example

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

## GitHub Actions

By default, tests run for each pull request to the `main` branch through the `run-tests.yml` workflow.

```yaml title='run-tests.yml'
name: run-tests

on:
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 16.x ]
    steps:
      - uses: actions/checkout@v2
      - name: Test api using jest
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm install
      - run: npm test
```

:::tip

To set up pull request rejection if tests failed visit `Settings > Branches` tab in your repository. Then add the branch [protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule
) "Require status checks to pass before merging".

:::
