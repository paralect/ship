import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import config from 'config';

const connection = new HubConnectionBuilder()
  .withUrl(config.WS_URL)
  .withAutomaticReconnect()
  .build();

export const connect = async () => {
  await connection.start();
};

export const disconnect = async () => {
  await connection.stop();
};

export const emit = async (event: string, ...args: any[]) => {
  await connection.invoke(event, ...args);
};

export const on = (event: string, callback: (...args: any[]) => void) => {
  connection.on(event, callback);
};

export const off = (event: string, callback: (...args: any[]) => void) => {
  connection.off(event, callback);
};

export const connected = () => connection.state === HubConnectionState.Connected;

export const disconnected = () => connection.state !== HubConnectionState.Connected;
