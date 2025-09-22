import _ from 'lodash';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { userSchema } from 'schemas';
import { User } from 'types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
  escapeRegExp: true,
  privateFields: ['passwordHash'],
});

service.createIndex({ email: 1 }, { unique: true });

const updateLastRequest = (_id: string) =>
  service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );

  const getPublic = (user: User | null) => service.getPublic(user);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
