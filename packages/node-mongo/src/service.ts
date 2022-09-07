import { cloneDeep, isEqual } from 'lodash';
import {
  WithoutId,
  ChangeStreamOptions,
  ClientSession,
  Collection,
  AggregateOptions,
  BulkWriteOptions,
  Filter,
  FindOptions,
  FindCursor,
  UpdateOneModel,
  CountDocumentsOptions,
  CreateIndexesOptions,
  FindOneAndReplaceOptions,
  FindOneAndDeleteOptions,
  MongoClient,
  DeleteOptions,
  IndexSpecification,
  OptionalUnlessRequiredId,
  TransactionOptions,
  UpdateFilter,
  FindOneAndUpdateOptions,
  ModifyResult,
  UpdateOptions,
  InsertOneOptions,
  AggregationCursor,
  AnyBulkWriteOperation,
  UpdateResult,
  DeleteResult,
  BulkWriteResult,
  IndexDescription, DropIndexesOptions, ReplaceOptions,
} from 'mongodb';

import {
  IDocument, FindResult, IChangePublisher, IDatabase, ServiceOptions, QueryDefaultsOptions,
} from './types';

import logger from './utils/logger';
import { addUpdatedOnField, generateId } from './utils/helpers';
import { inMemoryPublisher } from './events/in-memory';

const defaultOptions: ServiceOptions = {
  addCreatedOnField: true,
  addUpdatedOnField: true,
  outbox: false,
  requireDeletedOn: false,
};

const transactionOptions: TransactionOptions = {
  readConcern: { level: 'local' },
  writeConcern: { w: 1 },
};

class Service<T extends IDocument> {
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
    options: ServiceOptions = {},
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

  public get collectionName(): string {
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

  protected addQueryDefaults = (
    query: Filter<T> = {},
    options: QueryDefaultsOptions = {},
  ): Filter<T> => {
    if (query.deletedOn || this.options.requireDeletedOn || options.requireDeletedOn) {
      return query;
    }

    return { ...query, deletedOn: { $exists: false } };
  };

  protected validateQuery = (query: any, options: any) => {
    // A hook to add query validation
    // Often used to check if some required keys are always in the query
    // e.x. companyId or workspaceId
  };

  protected validateEntity = (item: Partial<T>): Promise<T> => {
    const entity = item;

    if (!entity._id) {
      entity._id = generateId();
    }

    if (!entity.createdOn && this.options.addCreatedOnField) {
      entity.createdOn = new Date();
    }

    if (!entity.updatedOn && this.options.addUpdatedOnField) {
      entity.updatedOn = new Date();
    }

    return this.validateSchema(entity);
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
    query: Filter<T>,
    options: FindOptions & QueryDefaultsOptions = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.findOne<T>(query, options);
  };

  find = async (
    query: Filter<T>,
    options: FindOptions & QueryDefaultsOptions & { page?: number; perPage?: number } = {},
  ): Promise<FindResult<T>> => {
    const collection = await this.getCollection();

    if (!options.page) options.page = 0;
    if (!options.perPage) options.perPage = 100;

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    const {
      page,
      perPage,
      ...opts
    } = options;

    const findOptions = {
      page,
      perPage,
      ...opts,
    };

    const hasPaging = page > 0;

    if (hasPaging) {
      findOptions.skip = (page - 1) * perPage;
      findOptions.limit = perPage;
    }

    const [results, count] = await Promise.all([
      collection.find<T>(query, findOptions).toArray(),
      collection.countDocuments(query),
    ]);

    const pagesCount = Math.ceil(count / perPage) || 1;

    return {
      pagesCount,
      results,
      count,
    };
  };

  cursor = async (
    query: Filter<T>,
    options: FindOptions = {},
  ): Promise<FindCursor<T>> => {
    const collection = await this.getCollection();

    return collection.find<T>(query, options);
  };

  exists = async (
    query: Filter<T>,
    options: FindOptions & QueryDefaultsOptions = {},
  ): Promise<boolean> => {
    const doc = await this.findOne(query, options);

    return Boolean(doc);
  };

  countDocuments = async (
    query: Filter<T> = {},
    options: CountDocumentsOptions & QueryDefaultsOptions = {},
  ): Promise<number> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.countDocuments(query, options);
  };

  async insertOne(
    object: Partial<T>,
    options: InsertOneOptions = {},
  ): Promise<T> {
    const collection = await this.getCollection();

    const validEntity = await this.validateEntity(object);

    const insertOneWithEvent = async (opts: InsertOneOptions): Promise<void> => {
      await collection.insertOne(validEntity as OptionalUnlessRequiredId<T>, opts);

      return this.changePublisher.publishDbChange(
        this._collectionName,
        'create',
        { doc: validEntity },
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => insertOneWithEvent({ session })));
    } else {
      await insertOneWithEvent(options);
    }

    return validEntity;
  }

  async insertMany(
    objects: Partial<T>[],
    options: BulkWriteOptions = {},
  ): Promise<T[]> {
    const collection = await this.getCollection();

    const validEntities = await Promise.all(objects.map(this.validateEntity));

    const insertManyWithEvents = async (opts: BulkWriteOptions): Promise<void> => {
      await collection.insertMany(validEntities as OptionalUnlessRequiredId<T>[], opts);

      return this.changePublisher.publishDbChanges(
        this._collectionName,
        'create',
        validEntities.map((e) => ({ doc: e })),
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => insertManyWithEvents({ session })));
    } else {
      await insertManyWithEvents(options);
    }

    return validEntities;
  }

  updateOne = async (
    query: Filter<T>,
    updateFn: (doc: T) => Partial<T>,
    options: UpdateOptions & QueryDefaultsOptions = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    const doc = await this.findOne(query);

    if (!doc) {
      logger.warn(`Document not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return null;
    }

    const prevDoc = cloneDeep(doc);

    const updatedFields = await updateFn(doc);

    const newDoc = { ...doc, ...updatedFields };
    const isUpdated = !isEqual(prevDoc, newDoc);

    if (!isUpdated) {
      logger.warn(`Document hasn't changed when updating ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return null;
    }

    if (this.options.addUpdatedOnField) {
      const updatedOnDate = new Date();

      updatedFields.updatedOn = updatedOnDate;
      newDoc.updatedOn = updatedOnDate;
    }

    await this.validateSchema(newDoc);

    const updateOneWithEvent = async (opts: UpdateOptions): Promise<void> => {
      await collection.updateOne(
        { _id: doc._id } as Filter<T>,
        { $set: updatedFields },
        opts,
      );

      return this.changePublisher.publishDbChange(
        this._collectionName,
        'update',
        { doc: newDoc, prevDoc },
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => updateOneWithEvent({ session })));
    } else {
      await updateOneWithEvent(options);
    }

    return newDoc;
  };

  updateMany = async (
    query: Filter<T>,
    updateFn: (doc: T) => Partial<T>,
    options: BulkWriteOptions & QueryDefaultsOptions = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    const documents = await collection.find<T>(query).toArray();

    if (documents.length === 0) {
      logger.warn(`Documents not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return [];
    }

    const updated = await Promise.all(
      documents.map(async (doc: T) => {
        const prevDoc = cloneDeep(doc);
        const updatedFields = await updateFn(doc);
        const newDoc = { ...doc, ...updatedFields };

        return {
          doc: newDoc,
          prevDoc,
          updatedFields,
          isUpdated: !isEqual(prevDoc, newDoc),
        };
      }),
    );

    const isUpdated = updated.find((u) => u.isUpdated) !== undefined;

    if (!isUpdated) {
      logger.warn(`Documents hasn't changed when updating ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return [];
    }

    if (this.options.addUpdatedOnField) {
      const updatedOnDate = new Date();

      updated.forEach((u) => {
        if (u.isUpdated) {
          u.doc.updatedOn = updatedOnDate;
          u.updatedFields.updatedOn = updatedOnDate;
        }
      });
    }

    await Promise.all((updated.map((u) => this.validateSchema(u.doc))));

    const updatedDocuments = updated.filter((u) => u.isUpdated);

    const updateManyWithEvents = async (opts: UpdateOptions): Promise<void> => {
      const bulkWriteQuery = updatedDocuments.map(
        (u): { updateOne: UpdateOneModel<T> } => {
          const filter = { _id: u.doc._id } as Partial<T>;

          return {
            updateOne: {
              filter,
              update: { $set: u.updatedFields },
            },
          };
        },
      );

      await collection.bulkWrite(bulkWriteQuery, options);

      return this.changePublisher.publishDbChanges(
        this._collectionName,
        'update',
        updatedDocuments.map((u) => ({ doc: u.doc, prevDoc: u.prevDoc })),
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => updateManyWithEvents({ session })));
    } else {
      await updateManyWithEvents(options);
    }

    return updated.map((u) => u.doc);
  };

  deleteSoft = async (
    query: Filter<T>,
    options: UpdateOptions & QueryDefaultsOptions = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    const docs = await collection.find<T>(query).toArray();

    if (docs.length === 0) {
      logger.warn(`Documents not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return [];
    }

    const deletedOnDate = new Date();
    const deletedDocuments = docs.map((doc) => ({ ...doc, deletedOn: deletedOnDate }));

    const deleteSoftWithEvent = async (opts: UpdateOptions): Promise<void> => {
      await collection.updateMany(
        query,
        { $set: { deletedOn: deletedOnDate } } as UpdateFilter<T>,
        opts,
      );

      return this.changePublisher.publishDbChanges(
        this._collectionName,
        'delete',
        deletedDocuments.map((doc) => ({ doc })),
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => deleteSoftWithEvent({ session })));
    } else {
      await deleteSoftWithEvent(options);
    }

    return deletedDocuments;
  };

  deleteOne = async (
    query: Filter<T>,
    options: DeleteOptions & QueryDefaultsOptions = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    const doc = await this.findOne(query, options);

    if (!doc) {
      logger.warn(`Document not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return null;
    }

    const deleteOneWithEvent = async (opts: DeleteOptions): Promise<void> => {
      await collection.deleteOne(query, opts);

      return this.changePublisher.publishDbChange(
        this._collectionName,
        'delete',
        { doc },
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => deleteOneWithEvent({ session })));
    } else {
      await deleteOneWithEvent(options);
    }

    return doc;
  };

  deleteMany = async (
    query: Filter<T>,
    options: DeleteOptions & QueryDefaultsOptions = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    const docs = await collection.find<T>(query).toArray();

    if (docs.length === 0) {
      logger.warn(`Documents not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(query)}`);
      return [];
    }

    const deleteManyWithEvents = async (opts: DeleteOptions): Promise<void> => {
      await collection.deleteMany(query, opts);

      return this.changePublisher.publishDbChanges(
        this._collectionName,
        'delete',
        docs.map((doc) => ({ doc })),
        { session: opts.session },
      );
    };

    if (this.options.outbox && !options.session) {
      await this.withTransaction(((session) => deleteManyWithEvents({ session })));
    } else {
      await deleteManyWithEvents(options);
    }

    return docs;
  };

  createIndex = async (
    indexSpec: IndexSpecification,
    options: CreateIndexesOptions = {},
  ): Promise<string | void> => {
    const collection = await this.getCollection();

    return collection.createIndex(indexSpec, options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  createIndexes = async (
    indexSpecs: IndexDescription[],
    options: CreateIndexesOptions = {},
  ): Promise<string[] | void> => {
    const collection = await this.getCollection();

    return collection.createIndexes(indexSpecs, options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  dropIndex = async (
    indexName: string,
    options: DropIndexesOptions = {},
  ): Promise<void | IDocument> => {
    const collection = await this.getCollection();

    return collection.dropIndex(indexName, options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  dropIndexes = async (
    options: DropIndexesOptions = {},
  ): Promise<void | IDocument> => {
    const collection = await this.getCollection();

    return collection.dropIndexes(options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  watch = async (
    pipeline: IDocument[] | undefined,
    options: ChangeStreamOptions = {},
  ): Promise<any> => {
    const collection = await this.getCollection();

    return collection.watch(pipeline, options);
  };

  distinct = async (
    key: string,
    query: Filter<T>,
    options: FindOptions & QueryDefaultsOptions = {},
  ): Promise<any> => {
    const collection = await this.getCollection();

    query = this.addQueryDefaults(query, options);
    this.validateQuery(query, options);

    return collection.distinct(key, query);
  };

  aggregate = async (
    pipeline: any[],
    options: AggregateOptions = {},
  ): Promise<any[]> => {
    const collection = await this.getCollection();

    return collection.aggregate(pipeline, options).toArray();
  };

  drop = async (recreate = false): Promise<void> => {
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
    findOne: async (
      filter: Filter<T>,
      options: FindOptions = {},
    ): Promise<T | null> => {
      const collection = await this.getCollection();

      return collection.findOne<T>(filter, options);
    },
    find: async (
      filter: Filter<T>,
      options: FindOptions = {},
    ): Promise<FindCursor<T>> => {
      const collection = await this.getCollection();

      return collection.find<T>(filter, options);
    },
    insertOne: async (
      doc: Partial<T>,
      options: InsertOneOptions = {},
    ): Promise<T> => {
      const collection = await this.getCollection();
      const validEntity = await this.validateEntity(doc);

      await collection.insertOne(validEntity as OptionalUnlessRequiredId<T>, options);

      return validEntity;
    },
    insertMany: async (
      docs: Partial<T>[],
      options: BulkWriteOptions = {},
    ): Promise<T[]> => {
      const collection = await this.getCollection();
      const validEntities = await Promise.all(docs.map(this.validateEntity));

      await collection.insertMany(validEntities as OptionalUnlessRequiredId<T>[], options);

      return validEntities;
    },
    updateOne: async (
      filter: Filter<T>,
      update: UpdateFilter<T> | Partial<T>,
      options: UpdateOptions = {},
    ): Promise<UpdateResult> => {
      const collection = await this.getCollection();

      if (this.options.addUpdatedOnField) {
        update = addUpdatedOnField(update);
      }

      return collection.updateOne(filter, update, options);
    },
    updateMany: async (
      filter: Filter<T>,
      update: UpdateFilter<T>,
      options: UpdateOptions = {},
    ): Promise<IDocument | UpdateResult> => {
      const collection = await this.getCollection();

      if (this.options.addUpdatedOnField) {
        update = addUpdatedOnField(update);
      }

      return collection.updateMany(filter, update, options);
    },
    deleteOne: async (
      filter: Filter<T>,
      options: DeleteOptions = {},
    ): Promise<DeleteResult> => {
      const collection = await this.getCollection();

      return collection.deleteOne(filter, options);
    },
    deleteMany: async (
      filter: Filter<T>,
      options: DeleteOptions = {},
    ): Promise<DeleteResult> => {
      const collection = await this.getCollection();

      return collection.deleteMany(filter, options);
    },
    replaceOne: async (
      filter: Filter<T>,
      replacement: WithoutId<T>,
      options: ReplaceOptions = {},
    ): Promise<UpdateResult | IDocument> => {
      const collection = await this.getCollection();

      if (this.options.addUpdatedOnField) {
        replacement.updatedOn = new Date();
      }

      return collection.replaceOne(filter, replacement, options);
    },
    bulkWrite: async (
      operations: AnyBulkWriteOperation<T>[],
      options: BulkWriteOptions = {},
    ): Promise<BulkWriteResult> => {
      const collection = await this.getCollection();

      return collection.bulkWrite(operations, options);
    },
    findOneAndUpdate: async (
      filter: Filter<T>,
      update: UpdateFilter<T>,
      options: FindOneAndUpdateOptions = {},
    ): Promise<ModifyResult<T>> => {
      const collection = await this.getCollection();

      if (this.options.addUpdatedOnField) {
        update = addUpdatedOnField(update);
      }

      return collection.findOneAndUpdate(filter, update, options);
    },
    findOneAndReplace: async (
      filter: Filter<T>,
      replacement: WithoutId<T>,
      options: FindOneAndReplaceOptions = {},
    ): Promise<ModifyResult<T>> => {
      const collection = await this.getCollection();

      if (this.options.addUpdatedOnField) {
        replacement.updatedOn = new Date();
      }

      return collection.findOneAndReplace(filter, replacement, options);
    },
    findOneAndDelete: async (
      filter: Filter<T>,
      options: FindOneAndDeleteOptions = {},
    ): Promise<ModifyResult<T>> => {
      const collection = await this.getCollection();

      return collection.findOneAndDelete(filter, options);
    },
    aggregate: async (
      pipeline: any[],
      options: AggregateOptions = {},
    ): Promise<AggregationCursor<IDocument>> => {
      const collection = await this.getCollection();

      return collection.aggregate(pipeline, options);
    },
  };

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
