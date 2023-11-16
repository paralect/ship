import { AppKoaContext, AppRouter, Next } from 'types';

import { userService } from 'resources/user';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isUserExists = await userService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  await userService.deleteSoft({ _id: ctx.request.params.id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
