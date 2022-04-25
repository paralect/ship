import { Migration } from 'migrations/migration.types';
import migrationService from 'migrations/migration.service';
import userService from 'resources/user/user.service';

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
  
  await migrationService.promiseLimit(userIds, 50, updateFn);
};

export default migration;
