import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

enum PageDirections {
  BACK = 'back',
  FORWARD = 'forward',
}

const stripeDirectionMap = {
  [PageDirections.BACK]: 'ending_before',
  [PageDirections.FORWARD]: 'starting_after',
};

const schema = z.object({
  cursorId: z.string().optional(),
  direction: z.enum([PageDirections.BACK, PageDirections.FORWARD]).default(PageDirections.FORWARD),
  perPage: z.string().transform(Number).default('5'),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertError(user.stripeId, 'Customer does not have a stripe account');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { direction, perPage, cursorId } = ctx.validatedData;
  const { user } = ctx.state;

  const charges = await stripeService.charges.list({
    limit: perPage,
    customer: user.stripeId as string,
    [stripeDirectionMap[direction]]: cursorId,
  });

  ctx.body = {
    data: charges.data,
    hasMore: direction === PageDirections.FORWARD ? charges.has_more : true,
    firstItemId: charges.data[0]?.id,
    lastItemId: charges.data[charges.data.length - 1]?.id,
  };
}

export default (router: AppRouter) => {
  router.get('/get-history', validateMiddleware(schema), validator, handler);
};
