import {
  ClientSession, Collection, CollectionOptions, CreateCollectionOptions, Document, MongoClient,
} from 'mongodb';

export type DbChangeType = 'create' | 'update' | 'delete';

export type InMemoryEventHandler = (evt: InMemoryEvent) => Promise<void> | void;

export type OnUpdatedProperties = Array<Record<string, unknown> | string>;

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

export type PopulateOptions = {
  localField: string | {
    name: string;
    isArray?: boolean;
    path?: string; // specifies which field to use from array objects (e.g., '_id', 'userId')
  };
  foreignField?: string; // default '_id'
  collection: string;
  fieldName: string;
};

export type ReadConfig = {
  skipDeletedOnDocs?: boolean,
  populate?: PopulateOptions | PopulateOptions[];
};

// Type-safe discriminated unions for populate operations
export type ReadConfigWithPopulate = ReadConfig & { 
  populate: PopulateOptions | PopulateOptions[]; 
};

export type ReadConfigWithoutPopulate = ReadConfig & { 
  populate?: never; 
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
  withTransaction: <TRes = any>(
    transactionFn: (session: ClientSession) => Promise<TRes>,
  ) => Promise<TRes>,
}

interface ServiceOptions {
  skipDeletedOnDocs?: boolean,
  schemaValidator?: (obj: any) => Promise<any>,
  publishEvents?: boolean,
  addCreatedOnField?: boolean,
  addUpdatedOnField?: boolean,
  outbox?: boolean,
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
  escapeRegExp?: boolean;
  privateFields?: string[];
}

export type UpdateFilterFunction<U> = (doc: U) => Partial<U>;

export {
  IDatabase,
  ServiceOptions,
};
