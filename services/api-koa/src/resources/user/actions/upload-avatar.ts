import config from 'config';
import userService from 'resources/user/user.service';
import cloudStorageService from 'services/cloud-storage/cloud-storage.service';
import uploadMiddleware from 'middlewares/upload-file.middleware';
import { Next, AppKoaContext, AppRouter } from 'types';


const getFileKey = (url: string) => url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, {
    global: 'File cannot be empty',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;
  const { file } = ctx.request;

  if (user.avatarUrl) {
    await cloudStorageService.deleteObject(getFileKey(user.avatarUrl));
  }

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
  const { Location } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  const updatedUser = await userService.update({ _id: user._id }, () => ({ avatarUrl: Location }));
  if (!updatedUser) {
    ctx.throw(404);
  }

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.post('/upload-photo', uploadMiddleware.single('file'), validator, handler);
};
