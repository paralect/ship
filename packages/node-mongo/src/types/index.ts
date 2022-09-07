import {
  ClientSession, Collection, CollectionOptions, CreateCollectionOptions, Document, MongoClient,
} from 'mongodb';
import { ObjectSchema } from 'joi';

export type DbChangeType = 'create' | 'update' | 'delete';

export type InMemoryEventHandler = (evt: InMemoryEvent) => Promise<void> | void;

export type OnUpdatedProperties<T = Record<string, unknown>> = Array<Partial<T> | keyof T>;

export type PublishEventOptions = {
  session: ClientSession | undefined
};

export type IChangePublisher = {
  publishDbChange: (
    collectionName: string,
    changeType: DbChangeType,
    eventData: DbChangeData,
    options?: PublishEventOptions,
  ) => Promise<void>,
  publishDbChanges: (
    collectionName: string,
    changeType: DbChangeType,
    eventsData: DbChangeData[],
    options?: PublishEventOptions,
  ) => Promise<void>,
};

export interface DbChangeData<T = any> {
  doc: T,
  prevDoc?: T
}

export type OutboxEvent<T = any> = {
  _id: string,
  type: 'create' | 'update' | 'delete',
  doc: T,
  prevDoc?: T,
  createdOn: Date
};

export type InMemoryEvent<T = any> = {
  doc: T,
  prevDoc?: T,
  name: string,
  createdOn: Date
};

export interface IDocument extends Document {
  _id: string;
  updatedOn?: Date;
  deletedOn?: Date | null;
  createdOn?: Date;
}

export type FindResult<T> = {
  results: T[];
  pagesCount: number;
  count: number;
};

export type CreateConfig = {
  validateSchema?: boolean,
  publishEvents?: boolean,
};

export type ReadConfig = {
  skipDeletedOnDocs?: boolean,
};

export type UpdateConfig = {
  skipDeletedOnDocs?: boolean,
  validateSchema?: boolean,
  publishEvents?: boolean,
};

export type DeleteConfig = {
  skipDeletedOnDocs?: boolean,
  publishEvents?: boolean,
};

interface IDatabase {
  getOutboxService: () => IChangePublisher;
  waitForConnection: () => Promise<void>;
  getOrCreateCollection: <TCollection extends Document>(
    name: string,
    opt: {
      collectionCreateOptions: CreateCollectionOptions;
      collectionOptions: CollectionOptions;
    },
  ) => Promise<Collection<TCollection> | null>;

  getClient: () => Promise<MongoClient | undefined>;
}

interface ServiceOptions {
  skipDeletedOnDocs?: boolean,
  validateSchema?: boolean,
  publishEvents?: boolean,
  addCreatedOnField?: boolean,
  addUpdatedOnField?: boolean,
  outbox?: boolean,
  schema?: ObjectSchema<any>;
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
}

export {
  IDatabase,
  ServiceOptions,
};
