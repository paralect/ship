import { eventBus, type InMemoryEvent } from '@ship/db';

import logger from '@/logger';
import type { User } from '@/resources/users/users.schema';
import { analyticsService } from '@/services';

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
