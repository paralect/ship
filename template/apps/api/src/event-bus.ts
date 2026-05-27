import type { MutationEvent, MutationType } from '@ship/db';
import { EventEmitter } from 'node:events';

type TableName = string;
type EventKey = `${TableName}.${MutationType}`;

// eslint-disable-next-line ts/no-explicit-any
type EventData = MutationEvent<any>;

class TypedEventBus {
  private emitter = new EventEmitter();

  emit(event: EventKey, data: EventData) {
    this.emitter.emit(event, data);
  }

  on(event: EventKey, handler: (data: EventData) => void) {
    this.emitter.on(event, handler);
  }

  /** Create an onMutation callback for a given table name */
  hook(tableName: TableName) {
    return (event: EventData) => {
      this.emit(`${tableName}.${event.type}`, event);
    };
  }
}

export const eventBus = new TypedEventBus();
