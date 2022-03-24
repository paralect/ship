const userService = require('resources/user/user.service');
const ioEmitter = require('ioEmitter');

userService.on('updated', ({ doc }) => {
  const roomId = `user-${doc._id}`;
  ioEmitter.to(roomId).emit('user:updated', doc);
});
