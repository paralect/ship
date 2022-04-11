const config = require('config');
const logger = require('logger');
const client = require('redis').createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});
const emitter = require('socket.io-emitter')(client);

emitter.redis.on('error', (err) => {
  logger.error(`Error publishing to sockets: ${err}`);
});

module.exports = emitter;
