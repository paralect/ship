import type { Message } from 'shared';
import { messageSchema } from 'shared';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

const service = db.createService<Message>(DATABASE_DOCUMENTS.MESSAGES, {
  schemaValidator: (obj) => messageSchema.parseAsync(obj),
});

service.createIndex({ chatId: 1 });
service.createIndex({ chatId: 1, createdOn: 1 });

export default service;
