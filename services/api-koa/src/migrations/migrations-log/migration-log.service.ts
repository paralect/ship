import db from 'db';
import schema from './migration-log.schema';
const service = db.createService('__migrationLog', { schema });

const startMigrationLog = (_id: string, startTime: number, migrationVersion: number) => {
  return service.atomic.findOneAndUpdate(
    { _id },
    {
      $set: {
        migrationVersion,
        startTime,
        status: 'running',
      },
      $setOnInsert: {
        _id,
      },
    },
    { upsert: true },
  );
};

const failMigrationLog = (_id: string, finishTime: number, err: Error) =>
  service.atomic.updateMany(
    { _id },
    {
      $set: {
        finishTime,
        status: 'failed',
        error: err.message,
        errorStack: err.stack,
      },
    },
  );

const finishMigrationLog = (_id: string, finishTime: number, duration: string) =>
  service.atomic.updateMany(
    { _id },
    {
      $set: {
        finishTime,
        status: 'completed',
        duration,
      },
    },
  );

export default { startMigrationLog, failMigrationLog, finishMigrationLog };
