const socketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');

const config = require('config');
const tokenService = require('resources/token/token.service');
const { COOKIES } = require('app.constants');

const socketHelper = require('./socket.helper');

const socketService = (server) => {
  const io = socketIo(server);

  io.adapter(redisAdapter({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  }));

  io.use(async (socket, next) => {
    const accessToken = socketHelper.getCookie(socket.handshake.headers.cookie, COOKIES.ACCESS_TOKEN);
    const userData = await tokenService.getUserDataByToken(accessToken);

    if (userData) {
      // eslint-disable-next-line no-param-reassign
      socket.handshake.data = {
        userId: userData.userId,
      };

      return next();
    }

    return next(new Error('token is invalid'));
  });

  io.on('connection', (client) => {
    client.on('subscribe', (roomId) => {
      const { userId } = client.handshake.data;
      const hasAccessToRoom = socketHelper.checkAccessToRoom(roomId, { userId });

      if (hasAccessToRoom) {
        client.join(roomId);
      }
    });

    client.on('unsubscribe', (roomId) => {
      client.leave(roomId);
    });
  });
};

module.exports = socketService;
