import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from './user.types';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  const user = data.doc;

  ioEmitter.publishToUser(user._id, 'user:updated', user);
});

eventBus.onUpdated(USERS, ['fullname'], (data: InMemoryEvent<User>) => {

});
