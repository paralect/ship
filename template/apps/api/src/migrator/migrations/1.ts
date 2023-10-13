import { userService } from 'resources/user';

import { promiseUtil } from 'utils';

import { Migration } from 'migrator/types';

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  const userIds = await userService.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (userId: string) => userService.atomic.updateOne(
    { _id: userId },
    { $set: { isEmailVerified: false } },
  );

  await promiseUtil.promiseLimit(userIds, 50, updateFn);
};

export default migration;
