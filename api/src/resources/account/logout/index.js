const authService = require('services/auth.service');

/**
 * Remove tokens for the user and logout
 */
const handler = async (ctx) => {
  await authService.unsetTokens(ctx);
  ctx.body = {};
};

module.exports.register = (router) => {
  router.post('/logout', handler);
};
