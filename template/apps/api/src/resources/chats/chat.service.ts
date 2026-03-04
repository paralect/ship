import type { Chat } from 'shared';
import { chatSchema } from 'shared';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

const service = db.createService<Chat>(DATABASE_DOCUMENTS.CHATS, {
  schemaValidator: (obj) => chatSchema.parseAsync(obj),
});

service.createIndex({ userId: 1 });
service.createIndex({ userId: 1, updatedOn: -1 });

export default service;
