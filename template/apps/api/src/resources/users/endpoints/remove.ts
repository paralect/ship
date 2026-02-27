import { userService } from 'resources/users';

import isAdmin from 'middlewares/isAdmin';
import createEndpoint from 'routes/createEndpoint';
import shouldExist from 'routes/middlewares/shouldExist';

export default createEndpoint({
  method: 'delete',
  path: '/:id',
  middlewares: [isAdmin, shouldExist('users')],

  async handler(ctx) {
    const { id } = ctx.request.params;

    await userService.deleteSoft({ _id: id });

    ctx.status = 204;
  },
});
