import { eventBus } from '@/event-bus';
import logger from '@/logger';
import { analyticsService } from '@/services';

eventBus.on('users.created', (data) => {
  try {
    const user = data.doc;

    analyticsService.track('New user created', {
      fullName: user.fullName,
    });
  } catch (err) {
    logger.error(`users.created handler error: ${err}`);
  }
});
