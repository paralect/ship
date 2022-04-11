const multer = require('@koa/multer');

const storage = multer.memoryStorage();

module.exports = multer({ storage });
