const multer = require('multer');

const memoryStorage = multer.memoryStorage();
const uploadMiddlewareMemory = multer({ storage: memoryStorage });

module.exports = { uploadMiddlewareMemory };
