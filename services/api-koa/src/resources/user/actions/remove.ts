import userService from 'resources/user/user.service';
import { AppKoaContext, AppRouter, Next } from 'types';

type ValidatedData = never;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const isExists = await userService.exists({ _id: ctx.request.params?.id });
  if (!isExists) {
    ctx.throw(404);
  }
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  await userService.removeSoft({ _id: ctx.request.params?.id });

  ctx.status = 204;
  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};