import { pub } from 'procedures';
import { z } from 'zod';

import { authService } from 'services';

const emptyOutput = z.object({});

export default pub.output(emptyOutput).handler(async ({ context }) => {
  await authService.unsetUserAccessToken({ ctx: context });
  return {};
});
