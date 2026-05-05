import { cloudStorageService } from '@ship/cloud-storage';
import { Buffer } from 'node:buffer';
import { z } from 'zod';

import { isAuthorized } from '@/procedures';

const outputSchema = z.object({
  key: z.string(),
  url: z.string(),
});

export default isAuthorized
  .input(z.object({ file: z.instanceof(File) }))
  .output(outputSchema)
  .handler(async ({ input }) => {
    const { file } = input;
    const key = `uploads/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await cloudStorageService.uploadBuffer(key, buffer, file.type);
    const url = await cloudStorageService.getSignedDownloadUrl(key);

    return { key, url };
  });
