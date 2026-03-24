import { createAdapter } from '@socket.io/redis-adapter';
import http from 'node:http';
import { Server } from 'socket.io';

import { COOKIES } from 'app-constants';

import socketHelper from './socket.helper';

import logger from '@/logger';
import pubClient, { redisErrorHandler } from '@/redis-client';
import validateAccessToken from '@/resources/tokens/methods/validate-access-token';

export default (server: http.Server) => {
  const io = new Server(server);

  const subClient = pubClient.duplicate();

  subClient.on('error', redisErrorHandler);

  io.adapter(createAdapter(pubClient, subClient));

  logger.info('[Socket.io] Server initialized successfully.');

  io.use(async (socket, next) => {
    if (!socket.handshake.headers.cookie) return next(new Error('Cookie not found'));

    const accessToken = socketHelper.getCookie(socket.handshake.headers.cookie, COOKIES.ACCESS_TOKEN);

    const token = await validateAccessToken(accessToken);

    if (token) {
      socket.data = {
        userId: token.userId,
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
