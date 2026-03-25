import { createAdapter } from '@socket.io/redis-adapter';
import http from 'node:http';
import { Server } from 'socket.io';

import { COOKIES } from 'app-constants';

import logger from '@/logger';
import pubClient, { redisErrorHandler } from '@/redis-client';
import validateAccessToken from '@/resources/tokens/methods/validate-access-token';

const getCookie = (cookieString: string, name: string) => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    const part = parts.pop();
    if (!part) {
      return null;
    }

    return part.split(';').shift();
  }

  return null;
};

const checkAccessToRoom = (roomId: string, data: { userId: string }) => {
  const [roomType, ...rest] = roomId.split('-');
  const id = rest.join('-');

  switch (roomType) {
    case 'user':
      return id === data.userId;
    default:
      return false;
  }
};

export default (server: http.Server) => {
  const io = new Server(server);

  const subClient = pubClient.duplicate();

  subClient.on('error', redisErrorHandler);

  io.adapter(createAdapter(pubClient, subClient));

  logger.info('[Socket.io] Server initialized successfully.');

  io.use(async (socket, next) => {
    if (!socket.handshake.headers.cookie) return next(new Error('Cookie not found'));

    const accessToken = getCookie(socket.handshake.headers.cookie, COOKIES.ACCESS_TOKEN);

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
      const hasAccessToRoom = checkAccessToRoom(roomId, { userId });

      if (hasAccessToRoom) {
        socket.join(roomId);
      }
    });

    socket.on('unsubscribe', (roomId) => {
      socket.leave(roomId);
    });
  });
};
