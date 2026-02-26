import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

import type { Chat } from './chat.schema';
import { chatSchema } from './chat.schema';

const service = db.createService<Chat>(DATABASE_DOCUMENTS.CHATS, {
  schemaValidator: (obj) => chatSchema.parseAsync(obj),
});

service.createIndex({ userId: 1 });
service.createIndex({ userId: 1, updatedOn: -1 });

export default service;
