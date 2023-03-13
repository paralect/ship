import { ZodSchema, ZodError, ZodIssue } from 'zod';

import { AppKoaContext, Next, ValidationErrors } from 'types';

function formatError(zodError: ZodError): ValidationErrors {
  const errors: ValidationErrors = {};

  zodError.issues.forEach((error: ZodIssue) => {
    const key = error.path.join('.');

    if (!errors[key]) {
      errors[key] = [];
    }
    (errors[key] as string[]).push(error.message);
  });

  return errors;
}

function validate(schema: ZodSchema) {
  return async (ctx: AppKoaContext, next: Next) => {
    const result = await schema.safeParseAsync({
      ...ctx.request.body as object,
      ...ctx.query,
      ...ctx.params,
    });

    if (!result.success) ctx.throw(400, { errors: formatError(result.error) });

    ctx.validatedData = result.data;
    await next();
  };
}

export default validate;
