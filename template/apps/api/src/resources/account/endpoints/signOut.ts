import { pub } from 'procedures';
import { z } from 'zod';

import { authService } from 'services';

export default pub.output(z.object({})).handler(async ({ context }) => {
  await authService.unsetUserAccessToken({ ctx: context });
  return {};
});
