import type { User } from 'resources/users/users.schema';

type PublicUser = Omit<User, 'passwordHash'>;

function getPublic(user: User): PublicUser;
function getPublic(user: User | null): PublicUser | null;
function getPublic(user: User | null): PublicUser | null {
  if (!user) return null;

  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export default getPublic;
