const authService = require('services/auth/auth.service');

const handler = async (ctx) => {
  await authService.unsetTokens(ctx);
  ctx.body = {};
};

module.exports.register = (router) => {
  router.post('/sign-out', handler);
};
