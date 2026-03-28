import { z } from 'zod';

import { isAuthorized } from '@/procedures';
import { cloudStorageService } from '@ship/cloud-storage';

export default isAuthorized
  .input(z.object({ key: z.string() }))
  .output(z.object({ url: z.string() }))
  .handler(async ({ input }) => {
    const url = await cloudStorageService.getSignedDownloadUrl(input.key);

    return { url };
  });
