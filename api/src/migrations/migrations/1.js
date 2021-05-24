const Migration = require('migrations/migration');

const migration = new Migration(1, 'Example');

migration.migrate = async () => {};

module.exports = migration;
