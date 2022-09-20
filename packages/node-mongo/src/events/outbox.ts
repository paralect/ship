import {
  Collection,
  CreateCollectionOptions,
  InsertOneOptions,
  BulkWriteOptions,
  CollectionOptions,
  Document,
} from 'mongodb';

import { generateId } from '../utils/helpers';

import {
  DbChangeData, IChangePublisher, PublishEventOptions, OutboxEvent, DbChangeType,
} from '../types';
import logger from '../utils/logger';

const isDev = process.env.NODE_ENV === 'development';

class OutboxService implements IChangePublisher {
  private getOrCreateCollection: <T extends Document>(
    name: string,
    opt: {
      collectionCreateOptions: CreateCollectionOptions; collectionOptions: CollectionOptions,
    },
  ) => Promise<Collection<T> | null>;

  private connectionPromise: Promise<void>;

  private connectionPromiseResolve?: (value: void) => void;

  private collectionsMap: { [key: string]: Collection<OutboxEvent> | null } = {};

  constructor(
    getOrCreateCollection: <T extends Document>(
      name: string,
      opt: {
        collectionCreateOptions: CreateCollectionOptions;
        collectionOptions: CollectionOptions,
      },
    ) => Promise<Collection<T> | null>,
    waitForConnection: () => Promise<void>,
  ) {
    this.connectionPromise = new Promise((res) => { this.connectionPromiseResolve = res; });

    waitForConnection().then(() => {
      if (this.connectionPromiseResolve) {
        this.connectionPromiseResolve();
      }
    });

    this.getOrCreateCollection = getOrCreateCollection;
  }

  private async waitForConnection() {
    await this.connectionPromise;
  }

  private getCollection = async (collectionName: string) => {
    if (this.collectionsMap[collectionName]) {
      return this.collectionsMap[collectionName];
    }

    const name = `${collectionName}_outbox`;

    const collection = await this.getOrCreateCollection<OutboxEvent>(
      name, { collectionCreateOptions: {}, collectionOptions: {} },
    );

    this.collectionsMap[collectionName] = collection;

    return collection;
  };

  private async createEvent(
    collectionName: string,
    changeType: DbChangeType,
    data: DbChangeData,
    option: InsertOneOptions = {},
  ): Promise<OutboxEvent | null> {
    await this.waitForConnection();

    const collection = await this.getCollection(collectionName);

    if (!collection) return null;

    const event: OutboxEvent = {
      _id: generateId(),
      createdOn: new Date(),
      type: changeType,
      ...data,
    };

    await collection.insertOne(event, option);

    if (isDev) {
      logger.info(`published outbox event: ${collectionName} ${changeType}`);
    }

    return event;
  }

  private async createManyEvents(
    collectionName: string,
    changeType: DbChangeType,
    data: DbChangeData[],
    option: BulkWriteOptions = {},
  ): Promise<OutboxEvent[] | null> {
    await this.waitForConnection();

    const collection = await this.getCollection(collectionName);

    if (!collection) return null;

    const events: OutboxEvent[] = data.map((e) => ({
      _id: generateId(),
      createdOn: new Date(),
      type: changeType,
      ...e,
    }));

    await collection.insertMany(events, option);

    if (isDev) {
      logger.info(`published outbox events: ${collectionName} ${changeType}`);
    }

    return events;
  }

  async publishDbChange(
    collectionName: string,
    changeType: DbChangeType,
    eventData: DbChangeData,
    options?: PublishEventOptions,
  ): Promise<void> {
    await this.createEvent(collectionName, changeType, eventData, { session: options?.session });
  }

  async publishDbChanges(
    collectionName: string,
    changeType: DbChangeType,
    eventsData: DbChangeData[],
    options?: PublishEventOptions,
  ): Promise<void> {
    await this.createManyEvents(
      collectionName, changeType, eventsData, { session: options?.session },
    );
  }
}

export default OutboxService;
