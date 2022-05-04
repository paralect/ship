---
sidebar_position: 5
---

# API action validator

## Overview

**API action validator** — is an array of functions (think middlewares) that is used to make sure that data sent by client is valid.


## Examples

```typescript
import Joi from 'joi';
import validate from 'middlewares/validate.middleware';
import userService from 'resources/user/user.service';
import { securityUtil } from 'utils';
import { Next, AppKoaContext, AppRouter } from 'types';

const schema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(50)
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    }),
});

type ValidatedData = {
  password: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);
  ctx.assertClientError(!isPasswordMatch, {
    password: 'The new password should be different from the previous one',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  // action code
}

export default (router: AppRouter) => {
  router.post('/current', validate(schema), validator, handler);
};

```
