const urlToken = async (ctx, next) => {
  if (ctx.query.authorization) {
    ctx.header.authorization = ctx.query.authorization;
  } else if (ctx.query.token) {
    ctx.header.authorization = `Bearer ${ctx.query.token}`;
  }

  await next();
};

module.exports = urlToken;
