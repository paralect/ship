import ioEmitter from 'io-emitter';
import { inMemoryEventBus, InMemoryEvent } from '@paralect/node-mongo';
import { User } from './user.types';

inMemoryEventBus.on('user.updated', (data: InMemoryEvent<User>) => {
  const user = data.data.object;
  ioEmitter.publishToUser(user._id, 'user:updated', user);
});
