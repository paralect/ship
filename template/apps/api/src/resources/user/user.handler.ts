import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { User } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

import logger from 'logger';
import ioEmitter from 'io-emitter';

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
    const user = data.doc;
    const fullName = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;

    await userService.atomic.updateOne(
      { _id: user._id },
      { $set: { fullName } },
    );
  } catch (err) {
    logger.error(`${USERS} onUpdated ['firstName', 'lastName'] handler error: ${err}`);
  }
});
