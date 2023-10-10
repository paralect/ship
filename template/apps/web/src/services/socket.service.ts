import io from 'socket.io-client';

import config from 'config';

const socket = io(config.WS_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

export const connect = async () => {
  socket.open();
};

export const disconnect = () => {
  socket.disconnect();
};

export const emit = (event: string, ...args: any[]) => {
  socket.emit(event, ...args);
};

export const on = (event: string, callback: (...args: any[]) => void) => {
  socket.on(event, callback);
};

export const off = (event: string, callback: (...args: any[]) => void) => {
  socket.off(event, callback);
};

export const connected = () => socket.connected;

export const disconnected = () => socket.disconnected;
