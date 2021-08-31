const cloudStorageService = require('services/cloud-storage.service');
const uploadMiddleware = require('middlewares/uploadMiddleware');

async function validate(ctx, next) {
  if (!ctx.file) {
    ctx.body = {
      errors: {
        file: ['File cannot be empty'],
      },
    };
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  try {
    const { user } = ctx.state;
    const fileName = `${user._id}-${Date.now()}-${ctx.file.originalname}`;
    const { key } = await cloudStorageService.upload(fileName, ctx.file);
    ctx.body = { key };
  } catch (error) {
    if (error.code) {
      ctx.body = {
        errors: {
          file: [`An error has occurred (${error.code})`],
        },
      };
      ctx.throw(error.statusCode);
    }
  }
}

module.exports.register = (router) => {
  router.post('/', uploadMiddleware.single('file'), validate, handler);
};
