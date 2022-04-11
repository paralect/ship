require('app-module-path').addPath(__dirname);

const migrator = require('migrations/migrator');

migrator.exec();
