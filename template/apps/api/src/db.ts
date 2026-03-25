import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import config from '@/config';
import { Collection } from '@/db.service';
import * as schema from '@/schema';

const client = postgres(config.DATABASE_URL);

export const rawDb = drizzle({ client, schema });

const db = {
  users: new Collection(schema.users, rawDb),
  tokens: new Collection(schema.tokens, rawDb),
};

export type User = typeof schema.users.$inferSelect;
export type Token = typeof schema.tokens.$inferSelect;

export default db;
