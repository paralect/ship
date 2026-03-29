import { eventBus, type InMemoryEvent } from '@ship/db';

import logger from '@/logger';
import type { User } from '@/resources/users/users.schema';
import { analyticsService } from '@/services';

eventBus.on(`users.created`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    analyticsService.track('New user created', {
      fullName: user.fullName,
    });
  } catch (err) {
    logger.error(`users.created handler error: ${err}`);
  }
});
