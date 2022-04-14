---
sidebar_position: 7
---

# Workflow

## Overview

`Workflow` — is a complex business operation that requires two or more data services to be used together. If a workflow is simple enough and used only in one place — it can be defined right in the Rest API action. If not — it should be placed into the ‘workflowName.workflow’ file. A most common workflow example is a `signup.workflow` that exposes `createUserAccount` function and used when new user signs up or receive an invite.

## Examples


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
