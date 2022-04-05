---
sidebar_position: 3
---

# REST API Reference

## Data Service

**Data Service** — is a layer that has two functions: database updates and domain functions. Database updates encapsulate the logic of updating and reading data in a database (also known as Repository Pattern in DDD). Domain functions use database updates to perform domain changes (e.x. `changeUserEmail`, `updateCredentials`, etc). For simplicity, we break the single responsibility pattern here. Data Service is usually named as `entity.service` (e.x. `user.service`).

```typescript
import _ from 'lodash';
import db from 'db';
import constants from 'app.constants';
import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>('users', { schema });

async function createInvitationToUser(email: string, companyId: string): Promise<User> {
  // the logic
}

export default Object.assign(service, { 
	createInvitationToUser,
});
```

## Database schema

**Database schema** — is a Joi schema that defines shape of the entity. It must strictly define all fields. The schema is defined in entity.schema file e.x. `user.schema`

```typescript
import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  companyId: Joi.string().allow(null).default(null),
  firstName: Joi.string().allow(null).default(null),
  lastName: Joi.string().allow(null).default(null),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().allow(null),
  signupToken: Joi.string().allow(null),
  timezone: Joi.string(),
  resetPasswordToken: Joi.string().allow(null),
  isEmailVerified: Joi.boolean().default(false),
});

export default schema;
```

## CUD events (Create, Update, Delete)


**CUD events (Create, Update, Delete)** — is a set of events published by `data layer` (paralect/node-mongo npm package). Events are the best solve three main problems:

- nicely update denormalized data (e.x.: use user.created and user.deleted to maintain usersCount field in the company)
- avoid tight coupling between your app entities (e.x. if you need to keep user updates history you can just subscribe to user updates in the history resource vs using history.service inside user.resource and marry user and history)
- they’re the best to integrate with external systems (e.x. events can be published as web hooks and webhooks can power real time Zapier triggers)

There are three types of events:

- entity.created event (e.x. user.created)
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.created',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
  },
};
```

- entity.updated event (e.x. user.updated). We use [diff](https://github.com/flitbit/diff) to calculate the raw difference between previous and current version of updated entity. diff object is too complex and should not be used directly. Instead, fields required by business logic should be exposed via change object e.x. previousUserEmail
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.updated',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
    diff: {},
    change: {}
  },
};
```

- entity.removed event (e.x. user.removed). 
```typescript
{
  _id: string,
  createdOn: Date,
  type: 'user.removed',
  userId: string,
  companyId: string,
  data: {
    object: {}, // user object stored here
  },
};
```

## Event handler 

**Event handler** — is a simple function that receives event as an argument and performs required logic. All event handlers should be stored in the /handlers folder within resource. Handler name should include event name e.x. `user.created.handler.ts`. That helps find all places were event is used. Direct database updates of the current resource entity are allowed within handler. 

## Rest API action

**Rest API action** — is HTTP handler that perform database updates and other logic required by the business logic. Actions should reside in the /actions folder within resource. Usually action is a single file that has meaningful name, e.x. list, getById, updateEmail. If action has a lot of logic and require multiple files it needs to be placed into the folder with name of the action and action need to exposed using module pattern (index.ts file). Direct database updates of the current resource entity are allowed within action. 

```typescript
import Router from '@koa/router';
import { KoaContext, ValidateResult } from 'types';
import { validationUtil } from '@paralect/utils';

type GetCompanies = {
  userId: string;
};

async function handler(ctx: KoaContext<GetCompanies>) {
  const { userId } = ctx.validatedData; // validatedData is returned by API validator
  ctx.body = {}; // action result sent to the client
}

export default (router: Router) => {
  // see Rest API validator
  router.get('/companies', validationUtil.validateMiddleware(validator), handler);
};
```

## Rest API validator

**Rest API validator** — is an array of functions (think middlewares) that is used to make sure that data sent by client is valid.

```typescript
import Joi from 'joi';

const schema = Joi.object({
  userId: Joi.string().max(50),
});

// If request is valid, data contains validated schema fields 
const validateFunc = async (data: Record<string, string>, ctx: KoaContext): Promise<ValidateResult<GetCompanies>> => {
  const { userId } = data;
  const userExists = await userSerivce.exists({ userId });

  if (!userExists) {
    ctx.status = 404;
    return {
      errors: [{ userId: 'User was not found' }],
    };
  }

  return {
    value: {
      userId,
    },
  };
};

const validator = [
  validationUtil.validate(schema),
  validateFunc,
];
```

## Workflow

Workflow — is a complex business operation that requires two or more data services to be used together. If a workflow is simple enough and used only in one place — it can be defined right in the Rest API action. If not — it should be placed into the ‘workflowName.workflow’ file. A most common workflow example is a `signup.workflow` that exposes `createUserAccount` function and used when new user signs up or receive an invite.

```typescript
import userService from 'resources/user/user.service';
import companyService from 'resources/company/company.service';

const signup = async ({
  firstName,
  surname,
  email,
}: {
  firstName: string;
  surname: string;
  email: string,
}) : Promise<User> => {
 
  let signedUpUser = null;
  await companyService.withTransaction(async (session: any) => {
    const companyId = companyService.generateId();
    await companyService.create({
      _id: companyId,
      name: '',
    },
    { session });

    signedUpUser = await userService.create({
      _id: userId,
      companyId,
      email,
      firstName,
      surname,
    },
    { session });
  });

  return signedUpUser;
};

export default {
  signup,
};
```
