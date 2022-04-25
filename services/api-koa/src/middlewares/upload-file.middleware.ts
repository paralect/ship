import multer from '@koa/multer';

const storage = multer.memoryStorage();

export default multer({ storage });
