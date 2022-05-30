import userService from 'resources/user/user.service';
import { AppKoaContext, AppRouter } from 'types';

type ValidatedData = never;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  await userService.removeSoft({ _id: ctx.request.params?.id });

  ctx.status = 204;
  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', handler);
};