import moment from 'moment';
import 'moment-duration-format';
import { generateId } from '@paralect/node-mongo';

import logger from 'logger';

import { Migration } from './types';
import migrationLogService from './migration-log/migration-log.service';
import migrationVersionService from './migration-version/migration-version.service';

interface Duration extends moment.Duration {
  format: (template?: string, precision?: number, settings?: DurationSettings) => string;
}

interface DurationSettings {
  forceLength: boolean;
  precision: number;
  template: string;
  trim: boolean | 'left' | 'right';
}

const run = async (migrations: Migration[], curVersion: number) => {
  const newMigrations = migrations.filter((migration: Migration) => migration.version > curVersion)
    .sort((a: Migration, b: Migration) => a.version - b.version);

  if (!newMigrations.length) {
    logger.info(`No new migrations found, stopping the process.
      Current database version is ${curVersion}`);
    return;
  }

  let migrationLogId;
  let migration;
  let lastMigrationVersion;

  try {
    for (migration of newMigrations) { //eslint-disable-line
      migrationLogId = generateId();
      const startTime = new Date().getSeconds();
      await migrationLogService.startMigrationLog(migrationLogId, startTime, migration.version); //eslint-disable-line
      logger.info(`Migration #${migration.version} is running: ${migration.description}`);
      if (!migration.migrate) {
        throw new Error('migrate function is not defined for the migration');
      }
      await migration.migrate(); //eslint-disable-line

      lastMigrationVersion = migration.version;
      await migrationVersionService.setNewMigrationVersion(migration.version); //eslint-disable-line
      const finishTime = new Date().getSeconds();
      const duration = (moment.duration(finishTime - startTime) as Duration)
        .format('h [hrs], m [min], s [sec], S [ms]');

      await migrationLogService.finishMigrationLog(migrationLogId, finishTime, duration); //eslint-disable-line
      logger.info(`Database has been updated to the version #${migration.version}`);
      logger.info(`Time of migration #${migration.version}: ${duration}`);
    }
    logger.info(`All migrations has been finished, stopping the process.
      Current database version is: ${lastMigrationVersion}`);
  } catch (err) {
    if (migration) {
      logger.error(`Failed to update migration to version ${migration.version}`);
      logger.error(err);
      if (migrationLogId) {
        await migrationLogService.failMigrationLog(migrationLogId, new Date().getSeconds(), err as Error);
      }
    }

    throw err;
  }
};

const exec = async () => {
  const [migrations, currentVersion] = await Promise.all([
    migrationVersionService.getMigrations(),
    migrationVersionService.getCurrentMigrationVersion(),
  ]);
  await run(migrations, currentVersion);
  process.exit(0);
};

export default {
  exec,
};
