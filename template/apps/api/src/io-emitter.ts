import { Emitter } from '@socket.io/redis-emitter';

import redisClient from 'redis-client';
import logger from 'logger';

import config from './config';

let emitter: Emitter | null = null;

const publish = (roomId: string | string[], eventName: string, data: unknown) => {
  if (emitter === null) {
    if (config.REDIS_ERRORS_POLICY === 'throw') {
      throw new Error('ioEmitter is not initialized.');
    } else {
      logger.debug('ioEmitter is not initialized.');
      return;
    }
  }

  logger.debug(`published io event [${eventName}] to ${roomId}, the data is: ${JSON.stringify(data)}`);

  emitter.to(roomId).emit(eventName, data);
};

const initClient = async () => {
  const subClient = redisClient.duplicate();
  await subClient.connect();

  emitter = new Emitter(subClient);
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
