import { ZodSchema, ZodError, ZodIssue } from 'zod';

import { AppKoaContext, Next, ValidationErrors } from 'types';

const formatError = (zodError: ZodError): ValidationErrors => {
  const errors: ValidationErrors = {};

  zodError.issues.forEach((error: ZodIssue) => {
    const key = error.path.join('.');

    if (!errors[key]) {
      errors[key] = [];
    }

    (errors[key] as string[]).push(error.message);
  });

  return errors;
};

const validate = (schema: ZodSchema) => async (ctx: AppKoaContext, next: Next) => {
  const result = await schema.safeParseAsync({
    ...ctx.request.body as object,
    ...ctx.query,
    ...ctx.params,
  });

  if (!result.success) ctx.throw(400, { clientErrors: formatError(result.error) });

  ctx.validatedData = result.data;

  await next();
};

export default validate;
