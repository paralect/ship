import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import type { User } from 'resources/users/users.schema';

import { analyticsService } from 'services';

import logger from 'logger';

eventBus.on(`users.created`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    const { firstName, lastName } = user;

    analyticsService.track('New user created', {
      firstName,
      lastName,
    });
  } catch (err) {
    logger.error(`users.created handler error: ${err}`);
  }
});
