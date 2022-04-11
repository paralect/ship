import {
  DbChangeData, DbChangeType, IChangePublisher, InMemoryEvent,
} from './types';

import inMemoryBus from './inMemoryEventBus';

class InMemoryPublisher implements IChangePublisher {
  private _bus = inMemoryBus;

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
      data: {
        object: eventData.data,
        diff: eventData.diff,
        change: null,
      },
    };

    this._bus.publish(name, evt);
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

export default inMemoryPublisher;
