import io from 'socket.io-client';

import config from 'config';

const socket = io(config.webSocketUrl, {
  transports: ['websocket'],
  autoConnect: false,
});

export const connect = async () => {
  socket.open();
};

export const disconnect = () => {
  socket.disconnect();
};

export const emit = (event, ...args) => {
  socket.emit(event, ...args);
};

export const on = (event, callback) => {
  socket.on(event, callback);
};

export const off = (event, callback) => {
  socket.off(event, callback);
};

export const connected = () => {
  return socket.connected;
};

export const disconnected = () => {
  return socket.disconnected;
};
