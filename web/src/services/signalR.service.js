// If you use this starter with .NET back-end then
// follow the instructions below, otherwise delete this file.

// 1. Uninstall `socket.io-client`
// 2. Delete `socket.service.js`
// 3. Install `@microsoft/signalr`
// 4. Rename this file to `socket.service.js`

import * as signalR from '@microsoft/signalr'; // eslint-disable-line import/no-unresolved

import config from 'config';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.webSocketUrl)
  .withAutomaticReconnect()
  .build();

export const connect = () => {
  connection.start();
};

export const disconnect = () => {
  connection.stop();
};

export const emit = (event, ...args) => {
  connection.send(event, ...args);
};

export const on = (event, callback) => {
  connection.on(event, callback);
};

export const off = (event, callback) => {
  connection.off(event, callback);
};

export const connected = () => {
  return connection.state === signalR.HubConnectionState.Connected;
};

export const disconnected = () => {
  return !connected();
};
