import io from 'socket.io-client';

import config from 'config';

const socket = io(config.apiUrl, {
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

export const connected = () => socket.connected;

export const disconnected = () => socket.disconnected;
