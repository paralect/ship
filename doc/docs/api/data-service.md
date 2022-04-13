---
sidebar_position: 3
---

# Data service


## Overview

**Data Service** — is a layer that has two functions: database updates and domain functions. Database updates encapsulate the logic of updating and reading data in a database (also known as Repository Pattern in DDD). Domain functions use database updates to perform domain changes (e.x. `changeUserEmail`, `updateCredentials`, etc). For simplicity, we break the single responsibility pattern here. Data Service is usually named as `entity.service` (e.x. `user.service`).


## Examples

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
