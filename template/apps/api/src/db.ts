import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import config from '@/config';
import { DbService } from '@/db.service';
import { tokens } from '@/resources/tokens/tokens.schema';
import { users } from '@/resources/users/users.schema';

const client = postgres(config.DATABASE_URL);

export const rawDb = drizzle({ client, schema: { users, tokens } });

const db = {
  users: new DbService(users, rawDb),
  tokens: new DbService(tokens, rawDb),
};

export type User = typeof users.$inferSelect;
export type Token = typeof tokens.$inferSelect;

export default db;
