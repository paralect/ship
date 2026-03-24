import type { Token } from 'resources/token/token.schema';
import { tokenSchema } from 'resources/token/token.schema';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
});

service.createIndex({ expiresOn: 1 }, { expireAfterSeconds: 0 });
service.createIndex({ userId: 1, type: 1 });

export default service;
