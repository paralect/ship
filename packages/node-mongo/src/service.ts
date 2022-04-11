import { cloneDeep, isArray } from 'lodash';
import { diff } from 'deep-diff';
import {
  ChangeStreamOptions,
  ClientSession,
  Collection,
  AggregateOptions,
  BulkWriteOptions,
  Filter,
  FindOptions,
  CreateIndexesOptions,
  MongoClient,
  IndexSpecification,
  OptionalUnlessRequiredId,
  TransactionOptions,
  UpdateFilter,
} from 'mongodb';

import logger from './logger';
import ServiceOptions from './types/ServiceOptions';
import { generateId } from './idGenerator';
import inMemoryPublisher from './dbChangePublisher';
import IDatabase from './types/IDatabase';
import { DbChangeData, IChangePublisher } from './types';

const defaultOptions: ServiceOptions = {
  addCreatedOnField: true,
  addUpdatedOnField: true,
  outbox: false,
  requireDeletedOn: true,
};

const transactionOptions: TransactionOptions = {
  readConcern: { level: 'local' },
  writeConcern: { w: 1 },
};

export type Document = {
  _id?: string;
  updatedOn?: string;
  deletedOn?: string | null;
  createdOn?: string;
};

export type FindResult<T> = {
  /**
   * Array of documents returned by query
   */
  results: T[];
  pagesCount: number;
  count: number;
};

type GeneralRequestOptions = {
  session?: ClientSession;
  doNotAddDeletedOn?: boolean;
};

type ExtendedFindOptions = FindOptions & {
  doNotAddDeletedOn?: boolean;
  page: number;
  perPage: number;
};

class Service<T extends Document> {
  private client?: MongoClient;

  private collection: Collection<T> | null;

  private _collectionName: string;

  private options: ServiceOptions;

  private db;

  private waitForConnection: () => Promise<void>;

  private changePublisher: IChangePublisher;

  constructor(
    collectionName: string,
    db: IDatabase,
    options: ServiceOptions = { },
  ) {
    this._collectionName = collectionName;
    this.db = db;
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.waitForConnection = db.waitForConnection;
    if (this.options.outbox) {
      this.changePublisher = db.getOutboxService();
    } else {
      this.changePublisher = inMemoryPublisher;
    }
    this.collection = null;

    this.db.getClient()
      .then((client) => {
        this.client = client;
      });
  }

  public get collectionName() : string {
    return this._collectionName;
  }

  public validateSchema = async (entity: T | Partial<T>): Promise<T> => {
    if (this.options.schema) {
      const { schema } = this.options;
      try {
        return await schema.validateAsync(entity);
      } catch (err: any) {
        logger.error(`Schema is not valid for ${this._collectionName} collection: ${err.stack || err}`, entity);
        throw err;
      }
    }

    return entity as T;
  };

  protected addQueryDefaults = <H extends { doNotAddDeletedOn?: boolean }>(
    query: Filter<T>, options: H,
  ): Filter<T> => {
    if (!query) {
      throw new Error(`MongoDB service query for [${this.collectionName}] collection must be defined`);
    }
    if (query.deletedOn) {
      return query;
    }
    if (!this.options.requireDeletedOn) {
      return query;
    }
    if (options.doNotAddDeletedOn) {
      return query;
    }

    return { ...query, deletedOn: { $exists: false } };
  };

  protected validateQuery = (query: any, options: GeneralRequestOptions) => {
    // A hook to add query validation
    // Often used to check if some required keys are always in the query
    // e.x. companyId or workspaceId
  };

  protected getCollection = async (): Promise<Collection<T>> => {
    await this.waitForConnection();
    if (!this.collection) {
      this.collection = await this.db.getOrCreateCollection<T>(this.collectionName, {
        collectionCreateOptions: this.options.collectionCreateOptions || {},
        collectionOptions: this.options.collectionOptions || {},
      });
      if (!this.collection) {
        throw new Error(`Mongo collection ${this._collectionName} is not initialized.`);
      }
    }

    return this.collection;
  };

  findOne = async (
    query: Filter<T> = { },
    options: GeneralRequestOptions = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.findOne<T>(query);
  };

  findAll = async (
    query: Filter<T>,
    options: FindOptions<T>,
  ): Promise<T[]> => {
    const collection = await this.getCollection();
    return collection.find<T>(query, options).toArray();
  };

  find = async (
    query: Filter<T> = {},
    options: ExtendedFindOptions = { perPage: 100, page: 0 },
  ): Promise<FindResult<T>> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    const {
      page,
      perPage,
      ...opts
    } = options;

    const findOptions: Record<string, unknown> = {
      page,
      perPage,
      ...opts,
    };
    const hasPaging = page > 0;
    if (hasPaging) {
      findOptions.skip = (page - 1) * perPage;
      findOptions.limit = perPage;
    }

    const results = await collection
      .find<T>(query, findOptions)
      .toArray();
    const count = await collection.countDocuments(query);
    const pagesCount = Math.ceil(count / perPage) || 1;

    return {
      pagesCount,
      results,
      count,
    };
  };

  cursor = async (
    query: Filter<T>, opt: FindOptions<T extends T ? T : T> = {},
  ): Promise<any> => {
    const collection = await this.getCollection();

    return collection.find<T>(query, opt);
  };

  exists = async (query: Filter<T>, options: GeneralRequestOptions = {}): Promise<boolean> => {
    const doc = await this.findOne(query, options);
    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return !!doc;
  };

  countDocuments = async (
    query: Filter<T>, options: GeneralRequestOptions = {},
  ): Promise<number> => {
    const collection = await this.getCollection();
    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.countDocuments(query);
  };

  async create(object: Partial<T>, options?: GeneralRequestOptions): Promise<T>;
  async create(objects: Partial<T>[], options?: GeneralRequestOptions): Promise<T[]>;
  async create(
    objects: Partial<T>[] | Partial<T>,
    options: GeneralRequestOptions = {},
  ): Promise<T[] | T> {
    const collection = await this.getCollection();

    if (!this.client) {
      throw new Error('MongoDB client is not connected');
    }

    const isCreateMany = isArray(objects);
    let entities: Partial<T>[] = [];
    if (isCreateMany) {
      entities = objects as Partial<T>[];
    } else {
      entities = [objects as Partial<T>];
    }
    if (entities.length === 0) {
      return [];
    }

    const validEntities = await Promise.all(entities.map(async (item: Partial<T>) => {
      const entity = item;
      if (!entity._id) {
        entity._id = generateId();
      }

      if (!entity.createdOn && this.options.addCreatedOnField) {
        entity.createdOn = new Date().toISOString();
      }
      if (!entity.updatedOn && this.options.addUpdatedOnField) {
        entity.updatedOn = new Date().toISOString();
      }

      return this.validateSchema(entity);
    }));

    const transactionCreate = async (session: ClientSession): Promise<void> => {
      if (!isArray(validEntities)) { // ts bug
        return;
      }

      await this.changePublisher.publishDbChanges(this._collectionName, 'create', validEntities.map((e) => ({
        data: e,
      })), { session });

      await collection.insertMany(
        validEntities as OptionalUnlessRequiredId<T>[],
        { session },
      );
    };

    if (options?.session) {
      await transactionCreate(options.session);
    } else {
      await this.withTransaction(async (session) => {
        await transactionCreate(session);
      });
    }

    return isCreateMany ? entities as T[] : entities[0] as T;
  }

  update = async (
    query: Filter<T>,
    updateFn: (doc: T) => void | Partial<T>,
    options?: GeneralRequestOptions,
  ): Promise<T | null> => {
    const collection = await this.getCollection();
    if (!this.client) {
      return null;
    }

    const doc = await this.findOne(query, options);
    if (!doc) {
      logger.warn(`Document not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return null;
    }

    const prevDoc = cloneDeep(doc);
    if (this.options.addUpdatedOnField) {
      doc.updatedOn = new Date().toISOString();
    }

    // Update function can return full document for update or partial
    const mbUpdatedDoc = await updateFn(doc);
    let updatedDoc: T = doc as T;
    if (mbUpdatedDoc) {
      updatedDoc = {
        ...updatedDoc,
        ...mbUpdatedDoc,
      };
    }
    const validatedDoc = await this.validateSchema(updatedDoc);

    let isUpdated = false;

    const transactionUpdate = async (session: ClientSession) => {
      const updateResult = await collection.updateOne({
        _id: validatedDoc._id,
      } as Filter<T>, { $set: validatedDoc }, { session });
      isUpdated = updateResult.modifiedCount === 1;

      if (isUpdated) {
        const change: DbChangeData = {
          data: {
            ...validatedDoc,
          },
          diff: diff(prevDoc, validatedDoc),
        };
        await this.changePublisher.publishDbChange(this._collectionName, 'update', change, { session });
      }
    };

    if (options?.session) {
      await transactionUpdate(options.session);
    } else {
      await this.withTransaction(async (session) => {
        await transactionUpdate(session);
      });
    }

    return isUpdated ? validatedDoc : null;
  };

  /**
   * Set deletedOn field and send removed event
   */
  removeSoft = async (query: Filter<T>, options: GeneralRequestOptions = {}): Promise<T[]> => {
    const collection = await this.getCollection();
    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);
    if (!this.client) {
      return [];
    }

    const docs = await collection.find<T>(query).toArray();

    if (docs.length === 0) {
      return [];
    }

    const transactionRemoveSoft = async (session: ClientSession) => {
      const dbChanges = docs.map((doc: any) => ({
        entity: this._collectionName,
        data: doc,
      }));

      await this.changePublisher.publishDbChanges(this._collectionName, 'remove', dbChanges, { session });

      const uq: any = {
        $set: {
          deletedOn: new Date().toISOString(),
        },
      };

      await collection.updateMany(
        query,
        uq,
        { session },
      );
    };

    if (options?.session) {
      await transactionRemoveSoft(options.session);
    } else {
      await this.withTransaction(async (session) => {
        await transactionRemoveSoft(session);
      });
    }

    return docs;
  };

  remove = async (
    query: Filter<T>,
    options: GeneralRequestOptions = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();
    this.validateQuery(query, options);
    if (!this.client) {
      return [];
    }

    const docs = await collection.find<T>(query).toArray();

    if (docs.length === 0) {
      return [];
    }

    const transactionRemove = async (session: ClientSession) => {
      const changes = docs.map((doc: any) => ({
        type: 'remove',
        entity: this._collectionName,
        data: doc,
      }));
      await this.changePublisher.publishDbChanges(this._collectionName, 'remove', changes, { session });
      await collection.deleteMany(query, { session });
    };

    if (options?.session) {
      await transactionRemove(options.session);
    } else {
      await this.withTransaction(async (session) => {
        await transactionRemove(session);
      });
    }

    return docs;
  };

  ensureIndex = async (
    index: IndexSpecification,
    options: CreateIndexesOptions = {},
  ): Promise<string | void> => {
    const collection = await this.getCollection();

    return collection.createIndex(index, options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  createIndex = async (
    index: IndexSpecification,
    options: CreateIndexesOptions = {},
  ): Promise<string | void> => this.ensureIndex(index, options);

  dropIndexes = async (
    options: TransactionOptions = {},
  ): Promise<void | Document> => {
    const collection = await this.getCollection();

    return collection.dropIndexes(options)
      .catch((err: any) => {
        logger.info(err);
      });
  };

  dropIndex = async (
    indexName: string,
    options: TransactionOptions = {},
  ): Promise<void | Document> => {
    const collection = await this.getCollection();

    return collection.dropIndex(indexName, options)
      .catch((err: any) => {
        logger.info(err);
      });
  };

  watch = async (
    pipeline: any[] | undefined,
    options?: ChangeStreamOptions & { session: ClientSession },
  ): Promise<any> => {
    const collection = await this.getCollection();

    return collection.watch(pipeline, options);
  };

  distinct = async (
    key: string, query: Filter<T>,
    options: GeneralRequestOptions = {},
  ): Promise<any> => {
    const collection = await this.getCollection();
    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.distinct(key, query);
  };

  aggregate = async (query: any[], options?: AggregateOptions): Promise<any> => {
    const collection = await this.getCollection();
    return collection.aggregate(query, options);
  };

  dropCollection = async (recreate = false): Promise<void> => {
    const collection = await this.getCollection();
    await collection.drop();

    if (recreate) {
      this.collection = await this.db.getOrCreateCollection<T>(this.collectionName, {
        collectionCreateOptions: this.options.collectionCreateOptions || {},
        collectionOptions: this.options.collectionOptions || {},
      });
    } else {
      this.collection = null;
    }
  };

  atomic = {
    deleteMany: async (
      query: Filter<T>,
      options: GeneralRequestOptions = {},
    ): Promise<any> => {
      const collection = await this.getCollection();
      this.validateQuery(query, options);

      return collection.deleteMany(query);
    },
    insertMany: async (
      doc: OptionalUnlessRequiredId<T>[], options: BulkWriteOptions = {},
    ): Promise<any> => {
      const collection = await this.getCollection();

      return collection.insertMany(doc, options);
    },
    updateMany: async (
      query: Filter<T>,
      update: Partial<T> | UpdateFilter<T>,
      options: GeneralRequestOptions = {},
    ): Promise<any> => {
      options.doNotAddDeletedOn = true;
      const collection = await this.getCollection();
      query = this.addQueryDefaults(query, options);
      this.validateQuery(query, options);

      return collection.updateMany(query, update);
    },
    findOneAndUpdate: async (
      query: Filter<T>,
      update: T | UpdateFilter<T>,
      options: GeneralRequestOptions = {},
    ): Promise<any> => {
      options.doNotAddDeletedOn = true;
      const collection = await this.getCollection();
      query = this.addQueryDefaults(query, options);
      this.validateQuery(query, options);

      let result = null;
      try {
        result = await collection.findOneAndUpdate(query, update);
      } catch (err: any) {
        logger.error(`${this.collectionName}, findOneAndUpdate() error: ${err.stack || err}`, { query, update, options });
        throw err;
      }

      return result;
    },
  };

  generateId = (): string => generateId();

  async withTransaction<TRes = any>(
    transactionFn: (session: ClientSession) => Promise<TRes>,
  ): Promise<TRes> {
    if (!this.client) {
      throw new Error('MongoDB client is not connected');
    }

    const session = this.client.startSession();

    let res: any;
    try {
      await session.withTransaction(async () => {
        res = await transactionFn(session);
      }, transactionOptions);
    } catch (error: any) {
      logger.error(error.stack || error);
      throw error;
    } finally {
      await session.endSession();
    }

    return res as TRes;
  }
}

export default Service;
