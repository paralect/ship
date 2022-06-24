import { Database, Service, ServiceOptions } from '@paralect/node-mongo';

import config from 'config';

const database = new Database(config.mongo.connection, config.mongo.dbName);
database.connect();

// Extended service can be used here.
function createService<T>(collectionName: string, options: ServiceOptions = {}) {
  return new Service<T>(collectionName, database, options);
}

export default {
  database,
  createService,
};
