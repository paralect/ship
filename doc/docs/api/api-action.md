---
sidebar_position: 4
---

# API action

## Overview

**API action** — is HTTP handler that perform database updates and other logic required by the business logic. Actions should reside in the /actions folder within resource. Usually action is a single file that has meaningful name, e.x. list, getById, updateEmail. If action has a lot of logic and require multiple files it needs to be placed into the folder with name of the action and action need to exposed using module pattern (index.ts file). Direct database updates of the current resource entity are allowed within action. 


## Examples

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
