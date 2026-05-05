import { EventEmitter } from 'node:events';

import type { User } from '@/db';

interface EventMap {
  'users.created': { doc: User };
  'users.updated': { doc: User; prevDoc?: User };
}

class TypedEventBus {
  private emitter = new EventEmitter();

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.emitter.emit(event, data);
  }

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void) {
    this.emitter.on(event, handler);
  }
}

export const eventBus = new TypedEventBus();
