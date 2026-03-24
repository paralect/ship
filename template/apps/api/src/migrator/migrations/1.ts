import { promiseUtil } from 'utils';

import { Migration } from 'migrator/types';

import { usersService } from 'db';

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  const userIds = await usersService.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (userId: string) =>
    usersService.atomic.updateOne({ _id: userId }, { $set: { isEmailVerified: false } });

  await promiseUtil.promiseLimit<string>(userIds, 50, updateFn);
};

export default migration;
