import { Database, Service, ServiceOptions } from '@paralect/node-mongo';

import config from 'config';

const database = new Database(config.mongo.connection, config.mongo.dbName);
database.connect();

class CustomService<T> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

export default {
  database,
  createService,
};
