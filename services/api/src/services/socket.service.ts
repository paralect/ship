import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';

import config from 'config';
import logger from 'logger';
import pubClient from 'redis-client';
import tokenResource from 'resources/token';

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

function checkAccessToRoom(roomId: string, data: { userId: string }) {
  const [roomType, ...rest] = roomId.split('-');
  const id = rest.join('-');
  
  switch (roomType) {
    case 'user':
      return id === data.userId;
    default:
      return false;
  }
}

export default async (server: http.Server) => {
  const io = new Server(server);
  
  const subClient = pubClient.duplicate();
  
  await Promise.all([pubClient.connect(), subClient.connect()]);
  logger.info('Socket.io server has been connected.');
  
  io.adapter(createAdapter(pubClient, subClient));
  
  io.use(async (socket, next) => {
    if (!socket.handshake.headers.cookie) return next(new Error('Cookie not found'));

    const accessToken = getCookie(socket.handshake.headers.cookie, config.accessTokenName);
    const tokenData = await tokenResource.service.findTokenByValue(accessToken || '');
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
