const handler = (ctx) => {
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/', handler);
};
