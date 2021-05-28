const Migration = require('migrations/migration');
// const migrationService = require('migrations/migration.service');
//
// const userService = require('resources/user/user.service');

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  // const userIds = await userService.distinct('_id', {
  //   isEmailVerified: true,
  // });
  //
  // await migrationService.promiseLimit(userIds, 50, (userId) => userService.updateOne(
  //   { _id: userId },
  //   (old) => ({
  //     ...old,
  //     isEmailVerified: false,
  //   }),
  // ));
};

module.exports = migration;
