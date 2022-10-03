import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from './user.types';
import { userService } from './index';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  const user = data.doc;

  ioEmitter.publishToUser(user._id, 'user:updated', user);
});

eventBus.onUpdated(USERS, ['firstName', 'lastName'], async (data: InMemoryEvent<User>) => {
  await userService.atomic.updateOne(
    { _id: data.doc._id },
    { $set: { fullName: `${data.doc.firstName} ${data.doc.lastName}` } },
  );
});
