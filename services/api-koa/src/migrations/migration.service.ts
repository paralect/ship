import db from 'db';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { MigrationDocument, Migration } from './migration.types';

import schema from './migration.schema';

const service = db.createService<MigrationDocument>('__migrationVersion', {
  schema,
});
const migrationsPath = path.join(__dirname, 'migrations');
const id = 'migration_version';

const getMigrationNames = (): string[] => {
  return fs.readdirSync(migrationsPath).filter(file => !file.endsWith('.js.map'));
};

const getCurrentMigrationVersion = () => service.findOne({ _id: id })
  .then((doc: MigrationDocument | null) => {
    if (!doc) {
      return 0;
    }

    return doc.version;
  });

const getMigrations = (): Migration[] => {
  let migrations = null;

  const names = getMigrationNames();
  migrations = names.map((name: string) => {
    const migrationPath = path.join(migrationsPath, name);
    return require(migrationPath);
  });

  return migrations;
};

const setNewMigrationVersion = (version: number) => service.atomic.findOneAndUpdate({ _id: id }, {
  $set: {
    version,
  },
  $setOnInsert: {
    _id: id,
  },
}, { upsert: true });

const promiseLimit = (documents: unknown[], limit: number, operator: (doc: any) => any): Promise<void> => {
  const chunks = _.chunk(documents, limit);

  return chunks.reduce((init: any, chunk) => {
    return init.then(() => {
      return Promise.all(chunk.map((c) => operator(c)));
    });
  }, Promise.resolve());
};

export default Object.assign(service, {
  getCurrentMigrationVersion,
  getMigrations,
  setNewMigrationVersion,
  promiseLimit,
});

