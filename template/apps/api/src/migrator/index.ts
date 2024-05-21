import { generateId } from '@paralect/node-mongo';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

import logger from 'logger';

import migrationLogService from './migration-log/migration-log.service';
import migrationVersionService from './migration-version/migration-version.service';
import { Migration } from './types';

dayjs.extend(durationPlugin);

const run = async (migrations: Migration[], curVersion: number) => {
  const newMigrations = migrations
    .filter((migration: Migration) => migration.version > curVersion)
    .sort((a: Migration, b: Migration) => a.version - b.version);

  if (!newMigrations.length) {
    logger.info(`[Migrator] No new migrations found, stopping the process.
      Current database version is ${curVersion}`);
    return;
  }

  let migrationLogId;
  let migration;
  let lastMigrationVersion;

  try {
    for (migration of newMigrations) {
      //eslint-disable-line
      migrationLogId = generateId();
      const startTime = dayjs();
      await migrationLogService.startMigrationLog(migrationLogId, startTime.get('seconds'), migration.version); //eslint-disable-line
      logger.info(`[Migrator] Migration #${migration.version} is running: ${migration.description}`);
      if (!migration.migrate) {
        throw new Error('migrate function is not defined for the migration');
      }
      await migration.migrate(); //eslint-disable-line

      lastMigrationVersion = migration.version;
      await migrationVersionService.setNewMigrationVersion(migration.version); //eslint-disable-line
      const finishTime = dayjs();
      const duration = dayjs.duration(finishTime.diff(startTime)).format('H [hrs], m [min], s [sec], SSS [ms]');

      await migrationLogService.finishMigrationLog(migrationLogId, finishTime.get('seconds'), duration); //eslint-disable-line
      logger.info(`[Migrator] Database has been updated to the version #${migration.version}`);
      logger.info(`[Migrator] Time of migration #${migration.version}: ${duration}`);
    }
    logger.info(`[Migrator] All migrations has been finished, stopping the process.
      Current database version is: ${lastMigrationVersion}`);
  } catch (err) {
    if (migration) {
      logger.error(`[Migrator] Failed to update migration to version ${migration.version}`);
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
