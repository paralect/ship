import { Database, IDocument, Service, ServiceOptions } from '@paralect/node-mongo';

import config from 'config';

const database = new Database(config.MONGO_URI, config.MONGO_DB_NAME);
database.connect();

const services: Record<string, Service<IDocument>> = {};

class CustomService<T extends IDocument> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  const service = new CustomService<T>(collectionName, database, options);
  services[collectionName] = service as unknown as Service<IDocument>;
  return service;
}

export default Object.assign(database, {
  createService,
  services,
});
