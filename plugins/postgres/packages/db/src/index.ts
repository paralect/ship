export { DbService } from './service';

// eslint-disable-next-line ts/no-explicit-any
export type User = Record<string, any>;

// eslint-disable-next-line ts/no-explicit-any
const db: Record<string, any> = {};

// eslint-disable-next-line ts/no-explicit-any
export let rawDb: any;

// eslint-disable-next-line ts/no-explicit-any
export function registerDb(services: Record<string, any>, drizzleDb: any) {
  Object.assign(db, services);
  rawDb = drizzleDb;
}

export default db;
