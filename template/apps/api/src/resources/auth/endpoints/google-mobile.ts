import { z } from 'zod';

import { isPublic } from '@/procedures';
import setAccessToken from '@/resources/tokens/methods/set-access-token';
import { publicSchema } from '@/resources/users/users.schema';
import { googleService } from '@/services';
import { ClientError } from '@/types';

export default isPublic
  .input(z.object({ idToken: z.string().min(1, 'ID token is required') }))
  .output(
    z.object({
      accessToken: z.string(),
      user: publicSchema,
    }),
  )
  .handler(async ({ input, context }) => {
    const { idToken } = input;

    const user = await googleService.validateIdToken(idToken);

    if (!user) {
      throw new ClientError({ credentials: 'Failed to authenticate with Google' });
    }

    const accessToken = await setAccessToken({ ctx: context, userId: user.id });

    return {
      accessToken,
      user,
    };
  });
