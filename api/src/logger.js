const { createConsoleLogger } = require('@paralect/common-logger');

const config = require('config');

module.exports = createConsoleLogger({ isDev: config.isDev });
