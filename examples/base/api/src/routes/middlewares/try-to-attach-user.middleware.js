const userService = require('resources/user/user.service');
const tokenService = require('resources/token/token.service');

const tryToAttachUser = async (ctx, next) => {
  let userData;

  if (ctx.state.accessToken) {
    userData = await tokenService.getUserDataByToken(ctx.state.accessToken);
  }

  if (userData) {
    await userService.updateLastRequest(userData.userId);
    ctx.state.user = await userService.findOne({ _id: userData.userId });
  }

  return next();
};

module.exports = tryToAttachUser;
