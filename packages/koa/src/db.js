const config = require('config');
const db = require('@paralect/node-mongo').connect(config.mongoUri);

module.exports = db;
