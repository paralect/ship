const auth = (ctx, next) => {
  if (ctx.state.user) {
    return next();
  }

  ctx.status = 401;
  ctx.body = {};
  return null;
};

module.exports = auth;
