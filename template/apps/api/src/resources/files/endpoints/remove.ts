import { cloudStorageService } from '@ship/cloud-storage';
import { z } from 'zod';

import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';

export default endpoint
  .use(isAuthorized)
  .input(z.object({ key: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await cloudStorageService.deleteObject(input.key);

    return { success: true };
  });
