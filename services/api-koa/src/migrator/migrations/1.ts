import { promiseUtil } from 'utils';
import { userService } from 'resources/user';
import { Migration } from 'migrator/types';

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  const userIds = await userService.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (userId: string) => userService.update(
    { _id: userId },
    () => ({
      isEmailVerified: false,
    }),
  );

  await promiseUtil.promiseLimit(userIds, 50, updateFn);
};

export default migration;
