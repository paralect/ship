const io = require('socket.io')();
const redisAdapter = require('socket.io-redis');

const config = require('config');
const tokenService = require('resources/token/token.service');
const { COOKIES } = require('app.constants');

io.adapter(redisAdapter({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
}));

const getCookie = (cookieString, name) => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift();
  }

  return null;
};

io.use(async (socket, next) => {
  const accessToken = getCookie(socket.handshake.headers.cookie, COOKIES.ACCESS_TOKEN);
  const userData = await tokenService.getUserDataByToken(accessToken);

  if (userData) {
    // eslint-disable-next-line no-param-reassign
    socket.handshake.data = { userId: userData.userId, isShadow: userData.isShadow };

    return next();
  }

  return next(new Error('token is invalid'));
});

function checkAccessToRoom(roomId, data) {
  let result = false;
  const [roomType, id] = roomId.split('-');

  switch (roomType) {
    case 'user':
      result = (id === data.userId);
      break;
    default:
      result = false;
  }

  return result;
}

io.on('connection', (client) => {
  client.on('subscribe', (roomId) => {
    const { userId } = client.handshake.data;
    const hasAccessToRoom = checkAccessToRoom(roomId, { userId });

    if (hasAccessToRoom) {
      client.join(roomId);
    }
  });

  client.on('unsubscribe', (roomId) => {
    client.leave(roomId);
  });
});

io.listen(config.socketPort);
