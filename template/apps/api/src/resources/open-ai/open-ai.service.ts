import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { aiChatSchema } from 'schemas';
import { AIChat } from 'types';

const service = db.createService<AIChat>(DATABASE_DOCUMENTS.AI_CHATS, {
  schemaValidator: (obj) => aiChatSchema.parseAsync(obj),
});

export default service;
