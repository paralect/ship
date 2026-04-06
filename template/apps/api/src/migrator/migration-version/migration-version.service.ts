import { readdirSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Migration } from 'migrator/types';

import db from 'db';

import schema from './migration-version.schema';
import { MigrationVersion } from './migration-version-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const service = db.createService<MigrationVersion>('__migrationVersion', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const migrationPaths = path.join(__dirname, '../migrations');
const id = 'migration_version';

const getMigrationNames = (): string[] => readdirSync(migrationPaths).filter((file) => !file.endsWith('.js.map'));

const getCurrentMigrationVersion = () =>
  service.findOne({ _id: id }).then((doc: MigrationVersion | null) => {
    if (!doc) {
      return 0;
    }

    return doc.version;
  });

const getMigrations = async (): Promise<Migration[]> => {
  const names = getMigrationNames();

  const migrations = await Promise.all(
    names.map(async (name: string) => {
      const migrationPath = path.join(migrationPaths, name);

      const migration = await import(migrationPath);

      return migration.default;
    }),
  );

  return migrations;
};

const setNewMigrationVersion = (version: number) =>
  service.atomic.updateOne(
    { _id: id },
    {
      $set: {
        version,
      },
      $setOnInsert: {
        _id: id,
      },
    },
    {},
    { upsert: true },
  );

export default Object.assign(service, {
  getCurrentMigrationVersion,
  getMigrations,
  setNewMigrationVersion,
});
