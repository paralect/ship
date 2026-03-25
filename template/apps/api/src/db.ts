import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import config from '@/config';
import * as schema from '@/schema';

const client = postgres(config.DATABASE_URL);

export const db = drizzle(client, { schema });

export const { users, tokens } = schema;
