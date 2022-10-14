import config from 'config';
import { cloudStorageService } from 'services';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService } from 'resources/user';

const getFileKey = (url: string) => decodeURI(url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, ''));

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.avatarUrl, {
    global: 'You don\'t have avatar',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const [updatedUser] = await Promise.all([
    userService.updateOne({ _id: user._id }, () => ({ avatarUrl: null })),
    cloudStorageService.deleteObject(getFileKey(user.avatarUrl || '')),
  ]);

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.delete('/avatar', validator, handler);
};
