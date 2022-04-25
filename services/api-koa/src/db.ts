import config from 'config';
import { Database, Service, ServiceOptions } from '@paralect/node-mongo';


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
