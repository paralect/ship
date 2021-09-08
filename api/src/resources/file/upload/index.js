const cloudStorageService = require('services/cloud-storage.service');
const uploadMiddleware = require('middlewares/uploadMiddleware');

async function validate(ctx, next) {
  ctx.assertError(!ctx.file, {
    file: ['File cannot be empty'],
  });

  await next();
}

async function handler(ctx) {
  try {
    const { user } = ctx.state;
    const fileName = `${user._id}-${Date.now()}-${ctx.file.originalname}`;
    const { key } = await cloudStorageService.upload(fileName, ctx.file);
    ctx.body = { key };
  } catch (error) {
    ctx.assertError(error.code, {
      file: [`An error has occurred (${error.code})`],
    }, error.statusCode);
  }
}

module.exports.register = (router) => {
  router.post('/', uploadMiddleware.single('file'), validate, handler);
};
