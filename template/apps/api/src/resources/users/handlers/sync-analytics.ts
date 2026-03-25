import { eventBus } from '@/event-bus';
import logger from '@/logger';
import { analyticsService } from '@/services';

eventBus.on('users.created', (data) => {
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
