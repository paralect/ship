import { z } from 'zod';

import { isAuthorized } from '@/procedures';
import { cloudStorageService } from '@ship/cloud-storage';

export default isAuthorized
  .input(z.object({ key: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await cloudStorageService.deleteObject(input.key);

    return { success: true };
  });
