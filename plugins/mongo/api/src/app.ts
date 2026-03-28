/* eslint-disable antfu/no-top-level-await */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '@/config';
import { initDb } from '@ship/db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await initDb(config.MONGO_URI, config.MONGO_DB_NAME, path.join(__dirname, 'resources'));

const { default: app } = await import('server');

export default app;
