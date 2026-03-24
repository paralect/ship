import { pub } from 'procedures';
import { z } from 'zod';

import setAccessToken from 'resources/tokens/methods/setAccessToken';
import { googleService } from 'services';

import config from 'config';

export default pub
  .route({
    method: 'GET',
    path: '/account/sign-in/google/callback',
    successStatus: 307,
    outputStructure: 'detailed',
  })
  .input(
    z.object({
      code: z.string().optional(),
      state: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    try {
      const user = await googleService.validateCallback({
        code: input.code,
        state: input.state,
        storedState: context.getCookie('google-oauth-state'),
        codeVerifier: context.getCookie('google-code-verifier'),
      });

      if (!user) {
        throw new Error('Failed to authenticate with Google');
      }

      await setAccessToken({ ctx: context, userId: user._id });

      return { headers: { location: config.WEB_URL } };
    } catch (error) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set(
        'error',
        encodeURIComponent(error instanceof Error ? error.message : 'Google authentication failed'),
      );
      return { headers: { location: url.toString() } };
    }
  });
