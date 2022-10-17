import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => {
  const date = new Date();

  return service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: date,
      },
    },
  );
};

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
