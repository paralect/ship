import { z } from 'zod';

import schema from './migration-version.schema';

export type MigrationVersion = z.infer<typeof schema>;
