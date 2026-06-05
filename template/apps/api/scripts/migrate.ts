import { migrate } from 'drizzle-orm/postgres-js/migrator';
import process from 'node:process';

import { rawDb as db } from '../src/db';

await migrate(db, { migrationsFolder: './drizzle' });
process.exit(0);
