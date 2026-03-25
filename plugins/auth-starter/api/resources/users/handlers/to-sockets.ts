import { eventBus } from '@/event-bus';
import ioEmitter from '@/io-emitter';
import logger from '@/logger';

eventBus.on('users.updated', (data) => {
  try {
    const { passwordHash: _, ...user } = data.doc;

    ioEmitter.publishToUser(user.id, 'user:updated', user);
  } catch (err) {
    logger.error(`users.updated handler error: ${err}`);
  }
});
