const userService = require('resources/user/user.service');

async function handler(ctx) {
  ctx.body = userService.getPublic(ctx.state.user);
}

module.exports.register = (router) => {
  router.get('/current', handler);
};
