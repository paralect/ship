import type { z } from 'zod';
import type { Service } from '@paralect/node-mongo';
import type tokensSchema from '@/resources/tokens/tokens.schema';
import type usersSchema from '@/resources/users/users.schema';
import { services } from '@/init-db';

const db = {
  users: services.users as Service<z.infer<typeof usersSchema>>,
  tokens: services.tokens as Service<z.infer<typeof tokensSchema>>,
};

export default db;
