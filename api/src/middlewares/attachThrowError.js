const attachThrowError = async (ctx, next) => {
  ctx.throwError = (errors = ['Something went wrong.'], status = 400) => {
    ctx.throw(status, errors);

    return null;
  };

  ctx.assertError = (condition, errors = ['Something went wrong.'], status = 400) => {
    ctx.assert(condition, status, errors);

    return null;
  };

  await next();
};

module.exports = attachThrowError;
