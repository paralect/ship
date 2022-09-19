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
  UpdateOneModel,
  CountDocumentsOptions,
  CreateIndexesOptions,
  MongoClient,
  DeleteOptions,
  IndexSpecification,
  OptionalUnlessRequiredId,
  TransactionOptions,
  UpdateFilter,
  UpdateOptions,
  InsertOneOptions,
  UpdateResult,
  Document,
  IndexDescription, DropIndexesOptions, ReplaceOptions, DistinctOptions,
} from 'mongodb';

import {
  IDocument,
  FindResult,
  IChangePublisher,
  IDatabase,
  ServiceOptions,
  ReadConfig, CreateConfig, UpdateConfig, DeleteConfig,
} from './types';

import logger from './utils/logger';
import { addUpdatedOnField, generateId } from './utils/helpers';
import { inMemoryPublisher } from './events/in-memory';

const defaultOptions: ServiceOptions = {
  skipDeletedOnDocs: true,
  validateSchema: true,
  publishEvents: true,
  outbox: false,
  addCreatedOnField: true,
  addUpdatedOnField: true,
};

const transactionOptions: TransactionOptions = {
  readConcern: { level: 'local' },
  writeConcern: { w: 1 },
};

const isDev = process.env.NODE_ENV === 'development';

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

  protected validateReadOperation = (
    query: Filter<T>,
    readConfig: ReadConfig,
  ): Filter<T> => {
    const shouldSkipDeletedDocs = typeof readConfig.skipDeletedOnDocs === 'boolean'
      ? readConfig.skipDeletedOnDocs
      : this.options.skipDeletedOnDocs;

    if (!query.deletedOn && shouldSkipDeletedDocs) {
      return { ...query, deletedOn: { $exists: false } };
    }

    return query;
  };

  protected validateCreateOperation = async (
    object: Partial<T>,
    createConfig: CreateConfig,
  ): Promise<T> => {
    let entity = object;

    if (!entity._id) {
      entity._id = generateId();
    }

    const timestamp = new Date();

    if (!entity.createdOn && this.options.addCreatedOnField) {
      entity.createdOn = timestamp;
    }

    if (!entity.updatedOn && this.options.addUpdatedOnField) {
      entity.updatedOn = timestamp;
    }

    const shouldValidateSchema = typeof createConfig.validateSchema === 'boolean'
      ? createConfig.validateSchema
      : this.options.validateSchema;

    if (shouldValidateSchema) {
      entity = await this.validateSchema(entity);
    }

    return entity as T;
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
    filter: Filter<T>,
    findOptions: FindOptions = {},
    readConfig: ReadConfig = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, readConfig);

    return collection.findOne<T>(filter, findOptions);
  };

  find = async (
    filter: Filter<T>,
    findOptions: FindOptions = {},
    readConfig: ReadConfig & { page?: number; perPage?: number } = {},
  ): Promise<FindResult<T>> => {
    const collection = await this.getCollection();
    const { page, perPage } = readConfig;
    const hasPaging = !!page && !!perPage;

    filter = this.validateReadOperation(filter, readConfig);

    if (!hasPaging) {
      const results = await collection.find<T>(filter, findOptions).toArray();

      return {
        pagesCount: 1,
        results,
        count: results.length,
      };
    }

    findOptions.skip = (page - 1) * perPage;
    findOptions.limit = perPage;

    const [results, count] = await Promise.all([
      collection.find<T>(filter, findOptions).toArray(),
      collection.countDocuments(filter),
    ]);

    const pagesCount = Math.ceil(count / perPage) || 1;

    return {
      pagesCount,
      results,
      count,
    };
  };

  exists = async (
    filter: Filter<T>,
    findOptions: FindOptions = {},
    readConfig: ReadConfig = {},
  ): Promise<boolean> => {
    const doc = await this.findOne(filter, findOptions, readConfig);

    return Boolean(doc);
  };

  countDocuments = async (
    filter: Filter<T>,
    countDocumentOptions: CountDocumentsOptions = {},
    readConfig: ReadConfig = {},
  ): Promise<number> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, readConfig);

    return collection.countDocuments(filter, countDocumentOptions);
  };

  distinct = async (
    key: string,
    filter: Filter<T>,
    distinctOptions: DistinctOptions = {},
    readConfig: ReadConfig = {},
  ): Promise<any[]> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, readConfig);

    return collection.distinct(key, filter, distinctOptions);
  };

  insertOne = async (
    object: Partial<T>,
    insertOneOptions: InsertOneOptions = {},
    createConfig: CreateConfig = {},
  ): Promise<T> => {
    const collection = await this.getCollection();

    const validEntity = await this.validateCreateOperation(object, createConfig);

    const shouldPublishEvents = typeof createConfig.publishEvents === 'boolean'
      ? createConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const insertOneWithEvent = async (opts: InsertOneOptions): Promise<void> => {
        await collection.insertOne(validEntity as OptionalUnlessRequiredId<T>, opts);

        return this.changePublisher.publishDbChange(
          this._collectionName,
          'create',
          { doc: validEntity },
          { session: opts.session },
        );
      };

      if (this.options.outbox && !insertOneOptions.session) {
        await this.withTransaction(((session) => insertOneWithEvent({ session })));
      } else {
        await insertOneWithEvent(insertOneOptions);
      }
    } else {
      await collection.insertOne(validEntity as OptionalUnlessRequiredId<T>, insertOneOptions);
    }

    return validEntity;
  };

  insertMany = async (
    objects: Partial<T>[],
    bulkWriteOptions: BulkWriteOptions = {},
    createConfig: CreateConfig = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    const validEntities = await Promise.all(objects.map(
      (o) => this.validateCreateOperation(o, createConfig),
    ));

    const shouldPublishEvents = typeof createConfig.publishEvents === 'boolean'
      ? createConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const insertManyWithEvents = async (opts: BulkWriteOptions): Promise<void> => {
        await collection.insertMany(validEntities as OptionalUnlessRequiredId<T>[], opts);

        return this.changePublisher.publishDbChanges(
          this._collectionName,
          'create',
          validEntities.map((e) => ({ doc: e })),
          { session: opts.session },
        );
      };

      if (this.options.outbox && !bulkWriteOptions.session) {
        await this.withTransaction(((session) => insertManyWithEvents({ session })));
      } else {
        await insertManyWithEvents(bulkWriteOptions);
      }
    } else {
      await collection.insertMany(validEntities as OptionalUnlessRequiredId<T>[], bulkWriteOptions);
    }

    return validEntities;
  };

  replaceOne = async (
    filter: Filter<T>,
    replacement: Partial<T>,
    replaceOptions: ReplaceOptions = {},
    readConfig: ReadConfig = {},
  ): Promise<UpdateResult | Document> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, readConfig);

    if (this.options.addUpdatedOnField) {
      replacement.updatedOn = new Date();
    }

    return collection.replaceOne(filter, replacement as WithoutId<T>, replaceOptions);
  };

  updateOne = async (
    filter: Filter<T>,
    updateFn: (doc: T) => Partial<T>,
    updateOptions: UpdateOptions = {},
    updateConfig: UpdateConfig = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    const doc = await this.findOne(filter, {}, updateConfig);

    if (!doc) {
      if (isDev) {
        logger.warn(`Document not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }
      return null;
    }

    const prevDoc = cloneDeep(doc);

    const updatedFields = await updateFn(doc);

    const newDoc = { ...doc, ...updatedFields };
    const isUpdated = !isEqual(prevDoc, newDoc);

    if (!isUpdated) {
      if (isDev) {
        logger.warn(`Document hasn't changed when updating ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }
      return newDoc;
    }

    if (this.options.addUpdatedOnField) {
      const updatedOnDate = new Date();

      updatedFields.updatedOn = updatedOnDate;
      newDoc.updatedOn = updatedOnDate;
    }

    const shouldValidateSchema = typeof updateConfig.validateSchema === 'boolean'
      ? updateConfig.validateSchema
      : this.options.validateSchema;

    if (shouldValidateSchema) {
      await this.validateSchema(newDoc);
    }

    const shouldPublishEvents = typeof updateConfig.publishEvents === 'boolean'
      ? updateConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const updateOneWithEvent = async (opts: UpdateOptions): Promise<void> => {
        await collection.updateOne(
          { _id: doc._id } as Filter<T>,
          { $set: updatedFields } as UpdateFilter<T>,
          opts,
        );

        return this.changePublisher.publishDbChange(
          this._collectionName,
          'update',
          { doc: newDoc, prevDoc },
          { session: opts.session },
        );
      };

      if (this.options.outbox && !updateOptions.session) {
        await this.withTransaction(((session) => updateOneWithEvent({ session })));
      } else {
        await updateOneWithEvent(updateOptions);
      }
    } else {
      await collection.updateOne(
        { _id: doc._id } as Filter<T>,
        { $set: updatedFields } as UpdateFilter<T>,
        updateOptions,
      );
    }

    return newDoc;
  };

  updateMany = async (
    filter: Filter<T>,
    updateFn: (doc: T) => Partial<T>,
    updateOptions: UpdateOptions = {},
    updateConfig: UpdateConfig = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, updateConfig);

    const documents = await collection.find<T>(filter).toArray();

    if (documents.length === 0) {
      if (isDev) {
        logger.warn(`Documents not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }
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
      if (isDev) {
        logger.warn(`Documents hasn't changed when updating ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }

      return updated.map((u) => u.doc);
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

    const shouldValidateSchema = typeof updateConfig.validateSchema === 'boolean'
      ? updateConfig.validateSchema
      : this.options.validateSchema;

    if (shouldValidateSchema) {
      await Promise.all((updated.map((u) => this.validateSchema(u.doc))));
    }

    const updatedDocuments = updated.filter((u) => u.isUpdated);
    const bulkWriteQuery = updatedDocuments.map(
      (u): { updateOne: UpdateOneModel<T> } => {
        const filterQuery = { _id: u.doc._id } as Partial<T>;

        return {
          updateOne: {
            filter: filterQuery,
            update: { $set: u.updatedFields } as UpdateFilter<T>,
          },
        };
      },
    );

    const shouldPublishEvents = typeof updateConfig.publishEvents === 'boolean'
      ? updateConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const updateManyWithEvents = async (opts: UpdateOptions): Promise<void> => {
        await collection.bulkWrite(bulkWriteQuery, updateOptions);

        return this.changePublisher.publishDbChanges(
          this._collectionName,
          'update',
          updatedDocuments.map((u) => ({ doc: u.doc, prevDoc: u.prevDoc })),
          { session: opts.session },
        );
      };

      if (this.options.outbox && !updateOptions.session) {
        await this.withTransaction(((session) => updateManyWithEvents({ session })));
      } else {
        await updateManyWithEvents(updateOptions);
      }
    } else {
      await collection.bulkWrite(bulkWriteQuery, updateOptions);
    }

    return updated.map((u) => u.doc);
  };

  deleteOne = async (
    filter: Filter<T>,
    deleteOptions: DeleteOptions = {},
    deleteConfig: DeleteConfig = {},
  ): Promise<T | null> => {
    const collection = await this.getCollection();

    const doc = await this.findOne(filter, {}, deleteConfig);

    if (!doc) {
      if (isDev) {
        logger.warn(`Document not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }

      return null;
    }

    const shouldPublishEvents = typeof deleteConfig.publishEvents === 'boolean'
      ? deleteConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const deleteOneWithEvent = async (opts: DeleteOptions): Promise<void> => {
        await collection.deleteOne(filter, opts);

        return this.changePublisher.publishDbChange(
          this._collectionName,
          'delete',
          { doc },
          { session: opts.session },
        );
      };

      if (this.options.outbox && !deleteOptions.session) {
        await this.withTransaction(((session) => deleteOneWithEvent({ session })));
      } else {
        await deleteOneWithEvent(deleteOptions);
      }
    } else {
      await collection.deleteOne(filter, deleteOptions);
    }

    return doc;
  };

  deleteMany = async (
    filter: Filter<T>,
    deleteOptions: DeleteOptions = {},
    deleteConfig: DeleteConfig = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, deleteConfig);

    const documents = await collection.find<T>(filter).toArray();

    if (documents.length === 0) {
      if (isDev) {
        logger.warn(`Documents not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }

      return [];
    }

    const shouldPublishEvents = typeof deleteConfig.publishEvents === 'boolean'
      ? deleteConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const deleteManyWithEvents = async (opts: DeleteOptions): Promise<void> => {
        await collection.deleteMany(filter, opts);

        return this.changePublisher.publishDbChanges(
          this._collectionName,
          'delete',
          documents.map((doc) => ({ doc })),
          { session: opts.session },
        );
      };

      if (this.options.outbox && !deleteOptions.session) {
        await this.withTransaction(((session) => deleteManyWithEvents({ session })));
      } else {
        await deleteManyWithEvents(deleteOptions);
      }
    } else {
      await collection.deleteMany(filter, deleteOptions);
    }

    return documents;
  };

  deleteSoft = async (
    filter: Filter<T>,
    deleteOptions: DeleteOptions = {},
    deleteConfig: DeleteConfig = {},
  ): Promise<T[]> => {
    const collection = await this.getCollection();

    filter = this.validateReadOperation(filter, deleteConfig);

    const documents = await collection.find<T>(filter).toArray();

    if (documents.length === 0) {
      if (isDev) {
        logger.warn(`Documents not found when deleting ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }

      return [];
    }

    const deletedOnDate = new Date();
    const deletedDocuments = documents.map((doc) => ({ ...doc, deletedOn: deletedOnDate }));

    const shouldPublishEvents = typeof deleteConfig.publishEvents === 'boolean'
      ? deleteConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const deleteSoftWithEvent = async (opts: UpdateOptions): Promise<void> => {
        await collection.updateMany(
          filter,
          { $set: { deletedOn: deletedOnDate } } as unknown as UpdateFilter<T>,
          opts,
        );

        return this.changePublisher.publishDbChanges(
          this._collectionName,
          'delete',
          deletedDocuments.map((doc) => ({ doc })),
          { session: opts.session },
        );
      };

      if (this.options.outbox && !deleteOptions.session) {
        await this.withTransaction(((session) => deleteSoftWithEvent({ session })));
      } else {
        await deleteSoftWithEvent(deleteOptions);
      }
    } else {
      await collection.updateMany(
        filter,
        { $set: { deletedOn: deletedOnDate } } as unknown as UpdateFilter<T>,
        deleteOptions,
      );
    }

    return deletedDocuments;
  };

  atomic = {
    updateOne: async (
      filter: Filter<T>,
      updateFilter: UpdateFilter<T>,
      updateOptions: UpdateOptions = {},
      updateConfig: UpdateConfig = {},
    ):Promise<UpdateResult> => {
      const collection = await this.getCollection();

      filter = this.validateReadOperation(filter, updateConfig);

      if (this.options.addUpdatedOnField) {
        updateFilter = addUpdatedOnField(updateFilter);
      }

      return collection.updateOne(filter, updateFilter, updateOptions);
    },
    updateMany: async (
      filter: Filter<T>,
      updateFilter: UpdateFilter<T>,
      updateOptions: UpdateOptions = {},
      updateConfig: UpdateConfig = {},
    ): Promise<Document | UpdateResult> => {
      const collection = await this.getCollection();

      filter = this.validateReadOperation(filter, updateConfig);

      if (this.options.addUpdatedOnField) {
        updateFilter = addUpdatedOnField(updateFilter);
      }

      return collection.updateMany(filter, updateFilter, updateOptions);
    },
  };

  aggregate = async (
    pipeline: any[],
    options: AggregateOptions = {},
  ): Promise<any[]> => {
    const collection = await this.getCollection();

    return collection.aggregate(pipeline, options).toArray();
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
  ): Promise<void | Document> => {
    const collection = await this.getCollection();

    return collection.dropIndex(indexName, options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  dropIndexes = async (
    options: DropIndexesOptions = {},
  ): Promise<void | Document> => {
    const collection = await this.getCollection();

    return collection.dropIndexes(options)
      .catch((err: any) => {
        logger.info(err, { collection: this.collectionName });
      });
  };

  watch = async (
    pipeline: Document[] | undefined,
    options: ChangeStreamOptions = {},
  ): Promise<any> => {
    const collection = await this.getCollection();

    return collection.watch(pipeline, options);
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
