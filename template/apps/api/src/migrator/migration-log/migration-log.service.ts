import db from 'db';

import schema from './migration-log.schema';
import { MigrationLog } from './migration-log.types';

const service = db.createService<MigrationLog>('__migrationLog', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const startMigrationLog = (_id: string, startTime: number, migrationVersion: number) =>
  service.atomic.updateOne(
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
    {}, { upsert: true },
  );

const failMigrationLog = (_id: string, finishTime: number, err: Error) =>
  service.atomic.updateOne(
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
  service.atomic.updateOne(
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
