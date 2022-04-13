import _ from 'lodash';
import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';
import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, { schema });

const updateLastRequest = async (_id: string) => {
  return service.atomic.updateMany({ _id }, {
    $set: {
      lastRequest: new Date(),
      updatedOn: new Date(),
    },
  });
};

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User) => {
  return _.omit(user, privateFields);
};

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
