import { authService } from 'services';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

export default createEndpoint({
  method: 'post',
  path: '/sign-out',
  middlewares: [isPublic],

  async handler(ctx) {
    await authService.unsetUserAccessToken({ ctx });

    ctx.status = 204;
  },
});
