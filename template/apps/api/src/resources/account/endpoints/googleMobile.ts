import { pub } from 'procedures';
import { z } from 'zod';

import { userService } from 'resources/users';
import { userPublicSchema } from 'resources/users/user.schema';

import { authService, googleService } from 'services';

import { ClientError } from 'types';

const publicUserOutput = userPublicSchema;

export default pub
  .input(z.object({ idToken: z.string().min(1, 'ID token is required') }))
  .output(
    z.object({
      accessToken: z.string(),
      user: publicUserOutput,
    }),
  )
  .handler(async ({ input, context }) => {
    const { idToken } = input;

    const user = await googleService.validateIdToken(idToken);

    if (!user) {
      throw new ClientError({ credentials: 'Failed to authenticate with Google' });
    }

    const accessToken = await authService.setAccessToken({ ctx: context, userId: user._id });

    return {
      accessToken,
      user: userService.getPublic(user),
    };
  });
