const config = require('config');

const userService = require('resources/user/user.service');
const cloudStorageService = require('services/cloud-storage/cloud-storage.service');
const uploadMiddleware = require('middlewares/upload-file.middleware');

const getFileKey = (url) => url.replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx, next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, {
    global: 'File cannot be empty',
  });

  await next();
}

async function handler(ctx) {
  const { user } = ctx.state;
  const { file } = ctx.request;

  if (user.avatarUrl) await cloudStorageService.deleteObject(getFileKey(user.avatarUrl));

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
  const { Location } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    (old) => ({
      ...old,
      avatarUrl: Location,
    }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

module.exports.register = (router) => {
  router.post('/upload-photo', uploadMiddleware.single('file'), validator, handler);
};
