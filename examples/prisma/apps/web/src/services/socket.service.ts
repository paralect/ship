import io from 'socket.io-client';

import config from 'config';

import { User } from 'types';

const socket = io(config.WS_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

export const connect = async () => {
  socket.open();
};

export const disconnect = () => {
  if (!socket.connected) return;

  socket.disconnect();
};

export const emit = (event: string, ...args: unknown[]) => {
  socket.emit(event, ...args);
};

type SocketListener = {
  (event: string, callback: (data: unknown) => void): void;
  (event: 'user:updated', callback: (user: User) => void): void;
};

export const on: SocketListener = (event, callback) => {
  socket.on(event, callback);
};

export const off = (event: string, callback: (...args: unknown[]) => void) => {
  socket.off(event, callback);
};

export const connected = () => socket.connected;

export const disconnected = () => socket.disconnected;
