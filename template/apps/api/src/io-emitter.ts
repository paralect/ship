import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';

import config from 'config';
import logger from 'logger';

let emitter: Emitter | null = null;
const redisClient = createClient({ url: config.REDIS_URI });

redisClient.on('error', err => {
  logger.error(`ioEmitter() => Redis error: ${err.stack || err}`);
  throw err;
});

const publish = (roomId: string | string[], eventName: string, data: unknown) => {
  if (emitter === null) {
    throw new Error('ioEmitter is not initialized.');
  }

  logger.debug(`published io event [${eventName}] to ${roomId}, the data is: ${JSON.stringify(data)}`);
  emitter.to(roomId).emit(eventName, data);
};

const initClient = async () => {
  await redisClient.connect();

  emitter = new Emitter(redisClient);
};

const getUserRoomId = (userId: string) => `user-${userId}`;

export default {
  initClient,
  publish,
  publishToUser: (userId: string, eventName: string, data: unknown): void => {
    const roomId = getUserRoomId(userId);

    publish(roomId, eventName, data);
  },
};
