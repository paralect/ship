import _ from 'lodash';

import { User } from 'types';
import { database } from 'database';

const updateLastRequest = async (id: number) =>
  database.user.update({
    where: { id },
    data: { lastRequest: new Date() },
  });

const privateFields = ['passwordHash', 'signupToken', 'resetPasswordToken'];

const getPublic = (user: User) => _.omit(user, privateFields);

export default Object.assign(database.user, {
  updateLastRequest,
  getPublic,
});
