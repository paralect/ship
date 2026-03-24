import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import type { User } from 'resources/users/user.schema';

import { analyticsService } from 'services';

import logger from 'logger';

import { DATABASE_DOCUMENTS } from 'app-constants';

const { USERS } = DATABASE_DOCUMENTS;

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
