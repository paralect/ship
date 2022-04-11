import { EventEmitter } from 'events';

import {
  InMemoryEvent, InMemoryEventHandler,
} from './types';

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
      evtCopy.createdOn = new Date().toISOString();
    }

    this._bus.emit(name, evtCopy);
  }

  on = (eventName: string, handler: InMemoryEventHandler): void => {
    this._bus.on(eventName, handler);
  };

  once = (eventName: string, handler: InMemoryEventHandler): void => {
    this._bus.once(eventName, handler);
  };
}

const eventBus = new EventBus();

export default eventBus;
