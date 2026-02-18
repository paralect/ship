import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

import type { Message } from './message.schema';
import { messageSchema } from './message.schema';

const service = db.createService<Message>(DATABASE_DOCUMENTS.MESSAGES, {
  schemaValidator: (obj) => messageSchema.parseAsync(obj),
});

service.createIndex({ chatId: 1 });
service.createIndex({ chatId: 1, createdOn: 1 });

export default service;
