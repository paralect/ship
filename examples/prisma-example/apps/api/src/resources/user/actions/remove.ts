import { userService } from 'resources/user';

import { AppKoaContext, AppRouter, Next } from 'types';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isUserExists = Boolean(await userService.findUnique({
    where: { id: +ctx.request.params.id },
    select: { id: true },
  }));
  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  await userService.delete({
    where: { id: +ctx.request.params.id },
  });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
