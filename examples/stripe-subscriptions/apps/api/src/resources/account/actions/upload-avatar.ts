import multer from '@koa/multer';

import config from 'config';
import { cloudStorageService } from 'services';
import { Next, AppKoaContext, AppRouter } from 'types';
import { userService } from 'resources/user';

const upload = multer();

const getFileKey = (url: string) => decodeURI(url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, ''));

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

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    () => ({ avatarUrl: Location }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.post('/avatar', upload.single('file'), validator, handler);
};
