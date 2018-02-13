const userService = require('resources/user/user.service');

const userMiddleware = async (ctx, next) => {
  if (!ctx.state.user) {
    await next();
    return;
  }

  const user = await userService.findById(ctx.state.user._id);
  ctx.assert(user, 'Not authorized: user not found', 401);

  ctx.state.user = user;
  await next();
};

module.exports = userMiddleware;
