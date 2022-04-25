import config from 'config';
import userService from 'resources/user/user.service';
import cloudStorageService from 'services/cloud-storage/cloud-storage.service';
import { AppKoaContext, Next, AppRouter } from 'types';

const getFileKey = (url: string) => url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.avatarUrl, {
    global: 'You don\'t have avatar',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  await Promise.all([
    cloudStorageService.deleteObject(getFileKey(user.avatarUrl || '')),
    userService.update({ _id: user._id }, () => ({ avatarUrl: null })),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/remove-photo', validator, handler);
};
