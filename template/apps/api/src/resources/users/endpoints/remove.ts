import { userService } from 'resources/users';

import isAdmin from 'middlewares/isAdmin';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'delete',
  path: '/:id',
  middlewares: [isAdmin],

  async handler(ctx) {
    const { id } = ctx.request.params;

    const isUserExists = await userService.exists({ _id: id });

    if (!isUserExists) {
      ctx.throwError('User not found');
    }

    await userService.deleteSoft({ _id: id });

    ctx.status = 204;
  },
});
