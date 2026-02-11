import { userService } from 'resources/users';

import { isAdmin } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

const validator = createMiddleware(async (ctx, next) => {
  const isUserExists = await userService.exists({ _id: ctx.params.id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
});

export default createEndpoint({
  method: 'delete',
  path: '/:id',
  middlewares: [isAdmin, validator],

  async handler(ctx) {
    await userService.deleteSoft({ _id: ctx.request.params.id });

    ctx.status = 204;
  },
});
