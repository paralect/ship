import { Database, type IDocument, Service, type ServiceOptions } from '@paralect/node-mongo';
import fs from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line ts/no-explicit-any
export type User = Record<string, any>;

// eslint-disable-next-line ts/no-explicit-any
const db: Record<string, any> = {};

let database: Database;

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}): Service<T> {
  return new Service<T>(collectionName, database, options);
}

export async function initDb(mongoUri: string, dbName: string, resourcesDir: string) {
  database = new Database(mongoUri, dbName);
  database.connect();

  const entries = fs.readdirSync(resourcesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirPath = path.join(resourcesDir, entry.name);
    const files = fs.readdirSync(dirPath);
    const schemaFiles = files.filter((f: string) => f.endsWith('.schema.ts') || f.endsWith('.schema.js'));

    for (const schemaFile of schemaFiles) {
      const collectionName = schemaFile.replace(/\.schema\.(ts|js)$/, '');
      const mod = await import(path.join(dirPath, schemaFile));
      const schema = mod.default;

      const service = createService(collectionName, {
        schemaValidator: (obj: unknown) => schema.parseAsync(obj),
        ...(mod.secureFields && { secureFields: mod.secureFields }),
      });

      if (mod.indexes) {
        for (const idx of mod.indexes) {
          service.createIndex(idx.fields, idx.options);
        }
      }

      db[collectionName] = service;
    }
  }
}

export { createService, database };
export { eventBus, type InMemoryEvent } from '@paralect/node-mongo';

export default db;
