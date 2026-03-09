import isPublic from 'middlewares/isPublic';
import { authService } from 'services';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'post',
  path: '/sign-out',
  middlewares: [isPublic],

  async handler(ctx) {
    await authService.unsetUserAccessToken({ ctx });

    ctx.status = 204;
  },
});
