import { z } from 'zod';
import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('5'),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.stripeId, { global: 'Customer does not have a stripe account' }, 500);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { page, perPage } = ctx.validatedData;
  const { user } = ctx.state;

  const results = [];
  for await (const charge of stripeService.charges.list({ limit: 100, customer: user.stripeId || undefined })) {
    results.push(charge);
  }

  ctx.body = {
    data: results.slice((page - 1) * perPage, page * perPage),
    count: results.length,
    totalPages: Math.ceil(results.length / perPage) || 1,
  };
}

export default (router: AppRouter) => {
  router.get('/get-history', validateMiddleware(schema), validator, handler);
};
