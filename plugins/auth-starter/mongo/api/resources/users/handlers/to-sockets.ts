import { eventBus, type InMemoryEvent } from '@ship/db';

import ioEmitter from '@/io-emitter';
import logger from '@/logger';
import type { User } from '@/resources/users/users.schema';

eventBus.on(`users.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', user);
  } catch (err) {
    logger.error(`users.updated handler error: ${err}`);
  }
});
