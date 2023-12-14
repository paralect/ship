import { Emitter } from '@socket.io/redis-emitter';

import redisClient, { redisErrorHandler } from 'redis-client';
import logger from 'logger';

let emitter: Emitter | null = null;

const publish = (roomId: string | string[], eventName: string, data: unknown) => {
  if (emitter === null) {
    redisErrorHandler(new Error('ioEmitter is not initialized.'));

    return;
  }

  logger.debug(`published io event [${eventName}] to ${roomId}, the data is: ${JSON.stringify(data)}`);

  emitter.to(roomId).emit(eventName, data);
};

const initClient = async () => {
  const subClient = redisClient.duplicate();

  await subClient.connect();

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
