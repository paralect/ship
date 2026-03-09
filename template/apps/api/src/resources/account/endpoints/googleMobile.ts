import { z } from 'zod';

import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { authService, googleService } from 'services';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});

export default createEndpoint({
  method: 'post',
  path: '/sign-in/google/token',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { idToken } = ctx.validatedData;

    const user = await googleService.validateIdToken(idToken);

    if (!user) {
      return ctx.throwClientError({
        credentials: 'Failed to authenticate with Google',
      });
    }

    const accessToken = await authService.setAccessToken({ ctx, userId: user._id });

    return {
      accessToken,
      user: userService.getPublic(user),
    };
  },
});
