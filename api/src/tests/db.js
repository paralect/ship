const config = require('config');
const db = require('@paralect/node-mongo').connect(config.mongo.connection);

module.exports = db;
