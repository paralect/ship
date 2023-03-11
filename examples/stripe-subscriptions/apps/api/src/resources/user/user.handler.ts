import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import logger from 'logger';
import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from './user.types';
import { userService } from './index';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', user);
  } catch (err) {
    logger.error(`${USERS}.updated handler error: ${err}`);
  }
});

eventBus.onUpdated(USERS, ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
  try {
    await userService.atomic.updateOne(
      { _id: data.doc._id },
      { $set: { fullName: `${data.doc.firstName} ${data.doc.lastName}` } },
    );
  } catch (err) {
    logger.error(`${USERS} onUpdated ['firstName', 'lastName'] handler error: ${err}`);
  }
});
