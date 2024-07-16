import { cloneDeep, cloneDeepWith, escapeRegExp, isEqual, isObject } from 'lodash';
import {
  WithoutId,
  ChangeStreamOptions,
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
  UpdateFilter,
  UpdateOptions,
  InsertOneOptions,
  UpdateResult,
  Document,
  IndexDescription, DropIndexesOptions, ReplaceOptions, DistinctOptions, IndexInformationOptions,
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
  publishEvents: true,
  outbox: false,
  addCreatedOnField: true,
  addUpdatedOnField: true,
  escapeRegExp: false,
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

  public validateSchema = async <U = T>(entity: U | Partial<U>): Promise<U | Partial<U>> => {
    if (this.options.schemaValidator) {
      const { schemaValidator } = this.options;

      try {
        const result = await schemaValidator(entity);

        return result;
      } catch (err: any) {
        logger.error(`Schema is not valid for ${this._collectionName} collection: ${err.stack || err}`, entity);
        throw err;
      }
    }

    return entity;
  };

  protected escapeFilterRegExp = <U = T>(
    query: Filter<U>,
  ): Filter<U> => {
    return cloneDeepWith(query, (value, key) => {
      if (!isObject(value)) {
        return key === '$regex' ? escapeRegExp(value) : value;
      }
    });
  };

  protected handleReadOperations = <U = T>(
    query: Filter<U>,
    readConfig: ReadConfig,
  ): Filter<U> => {
    const shouldSkipDeletedDocs = typeof readConfig.skipDeletedOnDocs === 'boolean'
      ? readConfig.skipDeletedOnDocs
      : this.options.skipDeletedOnDocs;

    if (!query.deletedOn && shouldSkipDeletedDocs) {
      query = { ...query, deletedOn: { $exists: false } };
    }

    if (this.options.escapeRegExp) {
      query = this.escapeFilterRegExp(query);
    }

    return query;
  };

  protected validateCreateOperation = async <U extends T = T>(
    object: Partial<U>,
    createConfig: CreateConfig,
  ): Promise<U> => {
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
      : Boolean(this.options.schemaValidator);

    if (shouldValidateSchema) {
      entity = await this.validateSchema(entity);
    }

    return entity as U;
  };

  protected getCollection = async <U extends T = T>(): Promise<Collection<U>> => {
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

    return this.collection as unknown as Collection<U>;
  };

  findOne = async <U extends T = T>(
    filter: Filter<U>,
    readConfig: ReadConfig = {},
    findOptions: FindOptions = {},
  ): Promise<U | null> => {
    const collection = await this.getCollection<U>();

    filter = this.handleReadOperations(filter, readConfig);

    return collection.findOne<U>(filter, findOptions);
  };

  find = async <U extends T = T>(
    filter: Filter<U>,
    readConfig: ReadConfig & { page?: number; perPage?: number } = {},
    findOptions: FindOptions = {},
  ): Promise<FindResult<U>> => {
    const collection = await this.getCollection<U>();
    const { page, perPage } = readConfig;
    const hasPaging = !!page && !!perPage;

    filter = this.handleReadOperations(filter, readConfig);

    if (!hasPaging) {
      const results = await collection.find<U>(filter, findOptions).toArray();

      return {
        pagesCount: 1,
        results,
        count: results.length,
      };
    }

    findOptions.skip = (page - 1) * perPage;
    findOptions.limit = perPage;

    const [results, count] = await Promise.all([
      collection.find<U>(filter, findOptions).toArray(),
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
    readConfig: ReadConfig = {},
    findOptions: FindOptions = {},
  ): Promise<boolean> => {
    const doc = await this.findOne(filter, readConfig, findOptions);

    return Boolean(doc);
  };

  countDocuments = async (
    filter: Filter<T>,
    readConfig: ReadConfig = {},
    countDocumentOptions: CountDocumentsOptions = {},
  ): Promise<number> => {
    const collection = await this.getCollection();

    filter = this.handleReadOperations(filter, readConfig);

    return collection.countDocuments(filter, countDocumentOptions);
  };

  distinct = async (
    key: string,
    filter: Filter<T>,
    readConfig: ReadConfig = {},
    distinctOptions: DistinctOptions = {},
  ): Promise<any[]> => {
    const collection = await this.getCollection();

    filter = this.handleReadOperations(filter, readConfig);

    return collection.distinct(key, filter, distinctOptions);
  };

  insertOne = async <U extends T = T>(
    object: Partial<U>,
    createConfig: CreateConfig = {},
    insertOneOptions: InsertOneOptions = {},
  ): Promise<U> => {
    const collection = await this.getCollection<U>();

    const validEntity = await this.validateCreateOperation<U>(object, createConfig);

    const shouldPublishEvents = typeof createConfig.publishEvents === 'boolean'
      ? createConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const insertOneWithEvent = async (opts: InsertOneOptions): Promise<void> => {
        await collection.insertOne(validEntity as OptionalUnlessRequiredId<U>, opts);

        return this.changePublisher.publishDbChange(
          this._collectionName,
          'create',
          { doc: validEntity },
          { session: opts.session },
        );
      };

      if (this.options.outbox && !insertOneOptions.session) {
        await this.db.withTransaction(((session) => insertOneWithEvent({ session })));
      } else {
        await insertOneWithEvent(insertOneOptions);
      }
    } else {
      await collection.insertOne(validEntity as OptionalUnlessRequiredId<U>, insertOneOptions);
    }

    return validEntity;
  };

  insertMany = async <U extends T = T>(
    objects: Partial<U>[],
    createConfig: CreateConfig = {},
    bulkWriteOptions: BulkWriteOptions = {},
  ): Promise<U[]> => {
    const collection = await this.getCollection<U>();

    const validEntities = await Promise.all(objects.map(
      (o) => this.validateCreateOperation<U>(o, createConfig),
    ));

    const shouldPublishEvents = typeof createConfig.publishEvents === 'boolean'
      ? createConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const insertManyWithEvents = async (opts: BulkWriteOptions): Promise<void> => {
        await collection.insertMany(validEntities as OptionalUnlessRequiredId<U>[], opts);

        return this.changePublisher.publishDbChanges(
          this._collectionName,
          'create',
          validEntities.map((e) => ({ doc: e })),
          { session: opts.session },
        );
      };

      if (this.options.outbox && !bulkWriteOptions.session) {
        await this.db.withTransaction(((session) => insertManyWithEvents({ session })));
      } else {
        await insertManyWithEvents(bulkWriteOptions);
      }
    } else {
      await collection.insertMany(validEntities as OptionalUnlessRequiredId<U>[], bulkWriteOptions);
    }

    return validEntities;
  };

  replaceOne = async (
    filter: Filter<T>,
    replacement: Partial<T>,
    readConfig: ReadConfig = {},
    replaceOptions: ReplaceOptions = {},
  ): Promise<UpdateResult | Document> => {
    const collection = await this.getCollection();

    filter = this.handleReadOperations(filter, readConfig);

    if (this.options.addUpdatedOnField) {
      replacement.updatedOn = new Date();
    }

    return collection.replaceOne(filter, replacement as WithoutId<T>, replaceOptions);
  };

  updateOne = async <U extends T = T>(
    filter: Filter<U>,
    updateFn: (doc: U) => Partial<U>,
    updateConfig: UpdateConfig = {},
    updateOptions: UpdateOptions = {},
  ): Promise<U | null> => {
    const collection = await this.getCollection<U>();

    filter = this.handleReadOperations(filter, updateConfig);

    const doc = await this.findOne<U>(filter, updateConfig);

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
      : Boolean(this.options.schemaValidator);

    if (shouldValidateSchema) {
      await this.validateSchema(newDoc);
    }

    const shouldPublishEvents = typeof updateConfig.publishEvents === 'boolean'
      ? updateConfig.publishEvents
      : this.options.publishEvents;

    if (shouldPublishEvents) {
      const updateOneWithEvent = async (opts: UpdateOptions): Promise<void> => {
        await collection.updateOne(
          { _id: doc._id } as Filter<U>,
          { $set: updatedFields } as UpdateFilter<U>,
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
        await this.db.withTransaction(((session) => updateOneWithEvent({ session })));
      } else {
        await updateOneWithEvent(updateOptions);
      }
    } else {
      await collection.updateOne(
        { _id: doc._id } as Filter<U>,
        { $set: updatedFields } as UpdateFilter<U>,
        updateOptions,
      );
    }

    return newDoc;
  };

  updateMany = async <U extends T = T>(
    filter: Filter<U>,
    updateFn: (doc: U) => Partial<U>,
    updateConfig: UpdateConfig = {},
    updateOptions: UpdateOptions = {},
  ): Promise<U[]> => {
    const collection = await this.getCollection<U>();

    filter = this.handleReadOperations(filter, updateConfig);

    const documents = await collection.find<U>(filter).toArray();

    if (documents.length === 0) {
      if (isDev) {
        logger.warn(`Documents not found when updating ${this._collectionName} collection. Request query — ${JSON.stringify(filter)}`);
      }
      return [];
    }

    const updated = await Promise.all(
      documents.map(async (doc) => {
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
      : Boolean(this.options.schemaValidator);

    if (shouldValidateSchema) {
      await Promise.all((updated.map((u) => this.validateSchema(u.doc))));
    }

    const updatedDocuments = updated.filter((u) => u.isUpdated);
    const bulkWriteQuery = updatedDocuments.map(
      (u): { updateOne: UpdateOneModel<U> } => {
        const filterQuery = { _id: u.doc._id } as Filter<U>;

        return {
          updateOne: {
            filter: filterQuery,
            update: { $set: u.updatedFields } as UpdateFilter<U>,
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
        await this.db.withTransaction(((session) => updateManyWithEvents({ session })));
      } else {
        await updateManyWithEvents(updateOptions);
      }
    } else {
      await collection.bulkWrite(bulkWriteQuery, updateOptions);
    }

    return updated.map((u) => u.doc);
  };

  deleteOne = async <U extends T = T>(
    filter: Filter<U>,
    deleteConfig: DeleteConfig = {},
    deleteOptions: DeleteOptions = {},
  ): Promise<U | null> => {
    const collection = await this.getCollection<U>();

    const doc = await this.findOne<U>(filter, deleteConfig);

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
        await this.db.withTransaction(((session) => deleteOneWithEvent({ session })));
      } else {
        await deleteOneWithEvent(deleteOptions);
      }
    } else {
      await collection.deleteOne(filter, deleteOptions);
    }

    return doc;
  };

  deleteMany = async <U extends T = T>(
    filter: Filter<U>,
    deleteConfig: DeleteConfig = {},
    deleteOptions: DeleteOptions = {},
  ): Promise<U[]> => {
    const collection = await this.getCollection<U>();

    filter = this.handleReadOperations(filter, deleteConfig);

    const documents = await collection.find<U>(filter).toArray();

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
        await this.db.withTransaction(((session) => deleteManyWithEvents({ session })));
      } else {
        await deleteManyWithEvents(deleteOptions);
      }
    } else {
      await collection.deleteMany(filter, deleteOptions);
    }

    return documents;
  };

  deleteSoft = async <U extends T = T>(
    filter: Filter<U>,
    deleteConfig: DeleteConfig = {},
    deleteOptions: DeleteOptions = {},
  ): Promise<U[]> => {
    const collection = await this.getCollection<U>();

    filter = this.handleReadOperations(filter, deleteConfig);

    const documents = await collection.find<U>(filter).toArray();

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
          { $set: { deletedOn: deletedOnDate } } as UpdateFilter<U>,
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
        await this.db.withTransaction(((session) => deleteSoftWithEvent({ session })));
      } else {
        await deleteSoftWithEvent(deleteOptions);
      }
    } else {
      await collection.updateMany(
        filter,
        { $set: { deletedOn: deletedOnDate } } as UpdateFilter<U>,
        deleteOptions,
      );
    }

    return deletedDocuments;
  };

  atomic = {
    updateOne: async (
      filter: Filter<T>,
      updateFilter: UpdateFilter<T>,
      readConfig: ReadConfig = {},
      updateOptions: UpdateOptions = {},
    ):Promise<UpdateResult> => {
      const collection = await this.getCollection();

      filter = this.handleReadOperations(filter, readConfig);

      if (this.options.addUpdatedOnField) {
        updateFilter = addUpdatedOnField(updateFilter);
      }

      return collection.updateOne(filter, updateFilter, updateOptions);
    },
    updateMany: async (
      filter: Filter<T>,
      updateFilter: UpdateFilter<T>,
      readConfig: ReadConfig = {},
      updateOptions: UpdateOptions = {},
    ): Promise<Document | UpdateResult> => {
      const collection = await this.getCollection();

      filter = this.handleReadOperations(filter, readConfig);

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

  indexExists = async (
    indexes: string | string[],
    indexInformationOptions: IndexInformationOptions = {},
  ): Promise<boolean> => {
    const collection = await this.getCollection();

    return collection.indexExists(indexes, indexInformationOptions);
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
  ): Promise<boolean | void> => {
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
}

export default Service;
