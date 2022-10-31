import { z } from 'zod';
import stripe from 'services/stripe/stripe.service';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('5'),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { page, perPage } = ctx.validatedData;
  const { user } = ctx.state;

  if (!user.stripeId) {
    // TODO: Create stripe user during registration?

    ctx.body = [];

    return;
  }

  const results = [];
  for await (const charge of stripe.charges.list({ limit: 100, customer: user.stripeId })) {
    results.push(charge);
  }

  ctx.body = {
    data: results.slice((page - 1) * perPage, page * perPage),
    count: results.length,
    totalPages: Math.ceil(results.length / perPage) || 1,
  };
}

export default (router: AppRouter) => {
  router.get('/get-history', validateMiddleware(schema), handler);
};
