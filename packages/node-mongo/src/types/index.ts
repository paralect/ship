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
  createdAt: Date
};

export type InMemoryEvent<T = any> = {
  doc: T,
  prevDoc?: T,
  name: string,
  createdAt: Date
};

export interface IDocument extends Document {
  _id: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdAt?: Date;
}

export type FindResult<T> = {
  results: T[];
  pagesCount: number;
  count: number;
};

export type CreateConfig = {
  validateSchema?: boolean,
  publishEvents?: boolean,
  isIncludeSecureFields?: boolean,
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
  skipDeletedAtDocs?: boolean,
  populate?: PopulateOptions | PopulateOptions[];
  isIncludeSecureFields?: boolean,
};

// Type-safe discriminated unions for populate operations
export type ReadConfigWithPopulate = ReadConfig & { 
  populate: PopulateOptions | PopulateOptions[]; 
};

export type ReadConfigWithoutPopulate = ReadConfig & { 
  populate?: never; 
};

export type UpdateConfig = {
  skipDeletedAtDocs?: boolean,
  validateSchema?: boolean,
  publishEvents?: boolean,
  isIncludeSecureFields?: boolean,
};

export type DeleteConfig = {
  skipDeletedAtDocs?: boolean,
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
  skipDeletedAtDocs?: boolean,
  schemaValidator?: (obj: any) => Promise<any>,
  publishEvents?: boolean,
  addCreatedAtField?: boolean,
  addUpdatedAtField?: boolean,
  outbox?: boolean,
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
  escapeRegExp?: boolean;
  secureFields?: string[];
}

export type UpdateFilterFunction<U> = (doc: U) => Partial<U>;

export {
  IDatabase,
  ServiceOptions,
};
