---
sidebar_position: 3
---

# Data schema

## Overview

**Data schema** — is a Joi schema that defines shape of the entity. It must strictly define all fields. The schema is defined in entity.schema file e.x. `user.schema`

## Examples

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
