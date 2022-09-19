// eslint-disable-next-line max-classes-per-file
import { EventEmitter } from 'events';

import {
  DbChangeData, DbChangeType, IChangePublisher, InMemoryEvent,
  InMemoryEventHandler, OnUpdatedProperties,
} from '../types';
import { deepCompare } from '../utils/helpers';
import logger from '../utils/logger';

class EventBus {
  private _bus: EventEmitter;

  constructor() {
    this._bus = new EventEmitter();
  }

  async publish(
    name: string, event: Partial<InMemoryEvent>,
  ): Promise<void> {
    const evtCopy = {
      ...event,
    };

    if (!evtCopy.createdOn) {
      evtCopy.createdOn = new Date();
    }

    this._bus.emit(name, evtCopy);
  }

  on = (eventName: string, handler: InMemoryEventHandler): void => {
    this._bus.on(eventName, handler);
  };

  once = (eventName: string, handler: InMemoryEventHandler): void => {
    this._bus.once(eventName, handler);
  };

  onUpdated = <T = Record<string, unknown>>(entity: string, properties: OnUpdatedProperties<T>, handler: InMemoryEventHandler): void => this.on(`${entity}.updated`, (event) => {
    const isChanged = deepCompare(
      event.doc,
      event.prevDoc,
      properties as Array<string | Record<string, unknown>>,
    );

    if (isChanged) handler(event);
  });
}

const eventBus = new EventBus();

class InMemoryPublisher implements IChangePublisher {
  private _bus = eventBus;

  private static getEventName(collectionName: string, eventType: DbChangeType) {
    return `${collectionName}.${eventType}d`;
  }

  async publishDbChange(
    collectionName: string,
    changeType: DbChangeType,
    eventData: DbChangeData,
  ): Promise<void> {
    const name = InMemoryPublisher.getEventName(collectionName, changeType);
    const evt: Partial<InMemoryEvent> = {
      name,
      doc: eventData.doc,
      prevDoc: eventData.prevDoc,
    };

    this._bus.publish(name, evt);

    logger.info(`published in-memory event: ${evt}`);
  }

  async publishDbChanges(
    collectionName: string,
    changeType: DbChangeType,
    eventsData: DbChangeData[],
  ): Promise<void> {
    eventsData.forEach((evt: DbChangeData) => {
      this.publishDbChange(collectionName, changeType, evt);
    });
  }
}

const inMemoryPublisher = new InMemoryPublisher();

export {
  inMemoryPublisher,
  eventBus,
};
