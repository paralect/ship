import { eventBus } from '@/event-bus';
import ioEmitter from '@/io-emitter';
import logger from '@/logger';

eventBus.on('users.update', (data) => {
  try {
    for (const user of data.docs) {
      logger.debug(`Emitting user:updated to user ${user.id} (${user.email})`);
      ioEmitter.publishToUser(user.id, 'user:updated', user);
    }
  } catch (err) {
    logger.error(`users.update handler error: ${err}`);
  }
});
