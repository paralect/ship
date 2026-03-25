import db from '@/db';
import { Migration } from '@/migrator/types';
import { promiseUtil } from '@/utils';

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  const userIds = await db.users.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (userId: string) => db.users.atomic.updateOne({ _id: userId }, { $set: { isEmailVerified: false } });

  await promiseUtil.promiseLimit<string>(userIds, 50, updateFn);
};

export default migration;
