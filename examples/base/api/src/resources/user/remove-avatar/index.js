const config = require('config');

const userService = require('resources/user/user.service');
const cloudStorageService = require('services/cloud-storage/cloud-storage.service');

const getFileKey = (url) => url.replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx, next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.avatarUrl, {
    global: 'You don\'t have avatar',
  });

  await next();
}

async function handler(ctx) {
  const { user } = ctx.state;

  await Promise.all([
    cloudStorageService.deleteObject(getFileKey(user.avatarUrl)),
    userService.updateOne(
      { _id: user._id },
      (old) => ({
        ...old,
        avatarUrl: null,
      }),
    ),
  ]);

  ctx.body = {};
}

module.exports.register = (router) => {
  router.delete('/remove-photo', validator, handler);
};
