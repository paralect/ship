import { Database, IDocument, Service, ServiceOptions } from '@paralect/node-mongo';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '@/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const database = new Database(config.MONGO_URI, config.MONGO_DB_NAME);
database.connect();

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}): Service<T> {
  return new Service<T>(collectionName, database, options);
}

export const services: Record<string, Service<IDocument>> = {};

export default async function init() {
  const resourcesDir = path.join(__dirname, 'resources');
  const entries = fs.readdirSync(resourcesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirPath = path.join(resourcesDir, entry.name);
    const files = fs.readdirSync(dirPath);
    const schemaFiles = files.filter((f) => f.endsWith('.schema.ts') || f.endsWith('.schema.js'));

    for (const schemaFile of schemaFiles) {
      const collectionName = schemaFile.replace(/\.schema\.(ts|js)$/, '');
      const mod = await import(path.join(dirPath, schemaFile));
      const schema = mod.default;

      const service = createService(collectionName, {
        schemaValidator: (obj) => schema.parseAsync(obj),
        ...(mod.secureFields && { secureFields: mod.secureFields }),
      });

      if (mod.indexes) {
        for (const idx of mod.indexes) {
          service.createIndex(idx.fields, idx.options);
        }
      }

      services[collectionName] = service;
    }
  }
}

export { createService, database };
