function formatError(joiError) {
  const errors = {};

  joiError.details.forEach((error) => {
    const key = error.path.join('.');
    errors[key] = errors[key] || [];
    errors[key].push(error.message);
  });

  return errors;
}

function validate(schema) {
  return async (ctx, next) => {
    const { value, error } = await schema.validate(
      {
        ...ctx.request.body,
        ...ctx.query,
      },
      {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: {
          objects: true,
        },
      },
    );

    if (error) ctx.throw(400, { errors: formatError(error) });

    ctx.validatedData = value;
    await next();
  };
}

module.exports = validate;
