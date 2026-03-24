import type { User } from 'resources/users/user.schema';
import { userSchema } from 'resources/users/user.schema';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
  escapeRegExp: true,
});

service.createIndex({ email: 1 }, { unique: true });

type PublicUser = Omit<User, 'passwordHash'>;

function getPublic(user: User): PublicUser;
function getPublic(user: User | null): PublicUser | null;
function getPublic(user: User | null): PublicUser | null {
  if (!user) return null;

  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export default Object.assign(service, {
  getPublic,
});
