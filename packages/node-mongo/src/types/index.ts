import { ClientSession } from 'mongodb';

export type DbChangeType = 'create' | 'update' | 'remove';

export interface DbChangeData {
  data: any;
  diff?: any[];

  entity?: string;
}

export type InMemoryEvent<T = any, TChange = any> = {
  name: string;
  createdOn: string;
  userId?: string;
  data: {
    object: T,
    diff?: any[],
    change?: TChange,
  },
};

export type InMemoryEventHandler = (evt: InMemoryEvent) => Promise<void> | void;

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

export type OutboxEvent = {
  _id: string;
  type: 'create' | 'update' | 'remove';
  data: any;
  diff?: any[];
  createdOn: string;
};
