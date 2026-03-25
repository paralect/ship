import { createAdapter } from '@socket.io/redis-adapter';
import http from 'node:http';
import { Server } from 'socket.io';

import logger from '@/logger';
import pubClient, { redisErrorHandler } from '@/redis-client';
import serverConfig from '@/server-config';

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

    const token = await serverConfig.socketAuth(socket.handshake.headers.cookie);

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
