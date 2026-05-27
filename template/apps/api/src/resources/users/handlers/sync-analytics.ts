import { eventBus } from '@/event-bus';
import logger from '@/logger';
import { analyticsService } from '@/services';

eventBus.on('users.insert', (data) => {
  try {
    for (const user of data.docs) {
      analyticsService.track('New user created', {
        fullName: user.fullName,
      });
    }
  } catch (err) {
    logger.error(`users.insert handler error: ${err}`);
  }
});
