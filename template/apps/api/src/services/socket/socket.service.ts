import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { COOKIES } from 'app-constants';

import { tokenService } from 'resources/token';

import pubClient, { redisErrorHandler } from 'redis-client';
import logger from 'logger';

import socketHelper from './socket.helper';

export default async (server: http.Server) => {
  const io = new Server(server);

  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  logger.info('Socket.io server has been connected.');

  subClient.on('error', redisErrorHandler);

  io.adapter(createAdapter(pubClient, subClient));

  io.use(async (socket, next) => {
    if (!socket.handshake.headers.cookie) return next(new Error('Cookie not found'));

    const accessToken = socketHelper.getCookie(socket.handshake.headers.cookie, COOKIES.ACCESS_TOKEN);
    const tokenData = await tokenService.findTokenByValue(accessToken || '');

    if (tokenData) {
      socket.data = {
        userId: tokenData.userId,
      };

      return next();
    }

    return next(new Error('Token is invalid'));
  });

  io.on('connection', (socket) => {
    socket.on('subscribe', (roomId: string) => {
      const { userId } = socket.data;
      const hasAccessToRoom = socketHelper.checkAccessToRoom(roomId, { userId });

      if (hasAccessToRoom) {
        socket.join(roomId);
      }
    });

    socket.on('unsubscribe', (roomId) => {
      socket.leave(roomId);
    });
  });
};
