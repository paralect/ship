import type { IDocument, Service } from '@paralect/node-mongo';
import type { z } from 'zod';
import type usersSchema from '@/resources/users/users.schema';
import { services } from '@/init-db';

type Db = {
  users: Service<z.infer<typeof usersSchema>>;
  // Any other collection is accessible via db.<name>
  [key: string]: Service<IDocument>;
};

const db = services as unknown as Db;

export type User = z.infer<typeof usersSchema>;

export default db;
