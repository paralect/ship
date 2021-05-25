require('app-module-path').addPath(__dirname);

const config = require('config');
const migrator = require('migrations/migrator');

if (!config.isTest) {
  migrator.exec();
}
