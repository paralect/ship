import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import type { User } from 'resources/users/users.schema';
import getPublic from 'resources/users/methods/getPublic';

import ioEmitter from 'io-emitter';

import logger from 'logger';

eventBus.on(`users.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', getPublic(user));
  } catch (err) {
    logger.error(`users.updated handler error: ${err}`);
  }
});
