import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { analyticsService } from 'services';

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

eventBus.on(`${USERS}.created`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    const { firstName, lastName } = user;

    analyticsService.track('New user created', {
      firstName,
      lastName,
    });
  } catch (err) {
    logger.error(`${USERS}.created handler error: ${err}`);
  }
});
