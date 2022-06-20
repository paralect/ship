import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';

import { User } from './user.types';

eventBus.on('users.updated', (data: InMemoryEvent<User>) => {
  const user = data.doc;

  ioEmitter.publishToUser(user._id, 'user:updated', user);
});
