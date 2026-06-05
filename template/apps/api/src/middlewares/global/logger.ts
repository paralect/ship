import { os } from '@orpc/server';

import appLogger, { loggerStorage } from '@/logger';
import type { ORPCContext } from '@/types';

const base = os.$context<ORPCContext>();

export default base.middleware(async ({ context, path, next }) => {
  const endpoint = path.at(-1) ?? 'unknown';
  const child = appLogger.child({ endpoint });
  return loggerStorage.run(child, () => next({ context }));
});
