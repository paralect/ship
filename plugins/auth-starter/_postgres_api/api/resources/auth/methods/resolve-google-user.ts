import type { User } from '@/db';
import db from '@/db';
import type { GoogleUserData } from '@/services/google/google.service';
import updateLastRequest from '@/resources/users/methods/update-last-request';

export default async function resolveGoogleUser(userData: GoogleUserData): Promise<User> {
  const { googleUserId, email, firstName, lastName, isEmailVerified, avatarUrl } = userData;

  const existingUser = await db.users.findFirst({ where: { googleUserId } });

  if (existingUser) {
    await updateLastRequest({ userId: existingUser.id });
    return existingUser as User;
  }

  const existingUserByEmail = await db.users.findFirst({ where: { email } });

  if (existingUserByEmail) {
    const updated = await db.users.updateOne(
      { id: existingUserByEmail.id },
      {
        googleUserId,
        googleConnectedAt: new Date(),
      },
    );

    await updateLastRequest({ userId: existingUserByEmail.id });
    return updated as User;
  }

  const newUser = await db.users.insertOne({
    firstName,
    lastName,
    email,
    isEmailVerified,
    avatarUrl,
    googleUserId,
    googleConnectedAt: new Date(),
  });

  return newUser as User;
}
