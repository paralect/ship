require('moment-duration-format');
const moment = require('moment');

const logger = require('logger');

const migrationLogService = require('./migrations-log/migration-log.service');
const migrationService = require('./migration.service');

const migrator = {};

const run = async (migrations, curVersion) => {
  const newMigrations = migrations.filter((migration) => migration.version > curVersion)
    .sort((a, b) => a.version - b.version);

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
      migrationLogId = migrationService.generateId();
      const startTime = new Date();
      await migrationLogService.startMigrationLog(migrationLogId, startTime, migration.version); //eslint-disable-line
      logger.info(`Migration #${migration.version} is running: ${migration.description}`);
      await migration.migrate(); //eslint-disable-line

      lastMigrationVersion = migration.version;
      await migrationService.setNewMigrationVersion(migration.version); //eslint-disable-line
      const finishTime = new Date();
      const duration = moment.duration(finishTime - startTime)
        .format('h [hrs], m [min], s [sec], S [ms]');

      await migrationLogService.finishMigrationLog(migrationLogId, finishTime, duration); //eslint-disable-line
      logger.info(`Database has been updated to the version #${migration.version}`);
      logger.info(`Time of migration #${migration.version}: ${duration}`);
    }
    logger.info(`All migrations has been finished, stopping the process.
      Current database version is: ${lastMigrationVersion}`);
  } catch (err) {
    logger.error(`Failed to update migration to version ${migration.version}`);
    logger.error(err);
    await migrationLogService.failMigrationLog(migrationLogId, new Date(), err);
    throw err;
  }
};

migrator.exec = async () => {
  const [migrations, currentVersion] = await Promise.all([
    migrationService.getMigrations(),
    migrationService.getCurrentMigrationVersion(),
  ]);
  await run(migrations, currentVersion);
  process.exit(0);
};

module.exports = migrator;
