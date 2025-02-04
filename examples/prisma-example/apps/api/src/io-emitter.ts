import { Emitter } from '@socket.io/redis-emitter';

import redisClient, { redisErrorHandler } from 'redis-client';

import logger from 'logger';

let emitter: Emitter | null = null;

const publish = (roomId: string | string[], eventName: string, data: unknown) => {
  if (emitter === null) {
    redisErrorHandler(new Error('[Socket.IO] Emitter is not initialized.'));

    return;
  }

  logger.debug(`[Socket.IO] Published [${eventName}] event to ${roomId}, the data is:`);
  logger.debug(data);

  emitter.to(roomId).emit(eventName, data);
};

const initClient = () => {
  const subClient = redisClient.duplicate();

  subClient.on('error', redisErrorHandler);

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
