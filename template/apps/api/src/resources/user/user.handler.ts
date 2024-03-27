import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';

import logger from 'logger';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { User } from 'types';

import userService from './user.service';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', userService.getPublic(user));
  } catch (err) {
    logger.error(`${USERS}.updated handler error: ${err}`);
  }
});

eventBus.onUpdated(USERS, ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;
    const fullName = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;

    await userService.atomic.updateOne({ _id: user._id }, { $set: { fullName } });
  } catch (err) {
    logger.error(`${USERS} onUpdated ['firstName', 'lastName'] handler error: ${err}`);
  }
});
