import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
  privateFields: ['passwordHash', 'signupToken', 'resetPasswordToken'],
});

const updateLastRequest = (_id: string) => {
  return service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
};

const getPublic = (user: User | null) => service.getPublic(user);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
