import { z } from 'zod';

import schema from './migration-log.schema';

export type MigrationLog = z.infer<typeof schema>;
