import {
  MongoClient,
  Collection,
  CreateCollectionOptions,
  CollectionOptions,
} from 'mongodb';

import OutboxService from '../outboxService';

export default interface IDatabase {
  getOutboxService: () => OutboxService;
  waitForConnection: () => Promise<void>;
  getOrCreateCollection: <TCollection>(
    name: string,
    opt: {
      collectionCreateOptions: CreateCollectionOptions;
      collectionOptions: CollectionOptions;
    },
  ) => Promise<Collection<TCollection> | null>;

  getClient: () => Promise<MongoClient | undefined>;
}
