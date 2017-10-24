const config = require('config');
const { createConsoleLogger } = require('@paralect/common-logger');

module.exports = createConsoleLogger({ isDev: config.isDev });
