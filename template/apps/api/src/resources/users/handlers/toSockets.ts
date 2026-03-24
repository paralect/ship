import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import type { User } from 'resources/users/user.schema';
import userService from 'resources/users/user.service';

import ioEmitter from 'io-emitter';

import logger from 'logger';

import { DATABASE_DOCUMENTS } from 'app-constants';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', userService.getPublic(user));
  } catch (err) {
    logger.error(`${USERS}.updated handler error: ${err}`);
  }
});
