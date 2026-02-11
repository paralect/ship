import { userService } from 'resources/users';

import { createEndpoint } from 'routes/types';

export default createEndpoint({
  method: 'get',
  path: '/',

  async handler(ctx) {
    const { user } = ctx.state;

    return userService.getPublic(user);
  },
});
