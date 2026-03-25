import type { User } from '@/db';
import db from '@/db';
import type { GoogleUserData } from '@/services/google/google.service';
import updateLastRequest from '@/resources/users/methods/update-last-request';

export default async function resolveGoogleUser(userData: GoogleUserData): Promise<User> {
  const { googleUserId, email, firstName, lastName, isEmailVerified, avatarUrl } = userData;

  const existingUser = await db.users.findOne({ 'oauth.google.userId': googleUserId });

  if (existingUser) {
    await updateLastRequest({ userId: existingUser._id });
    return existingUser as User;
  }

  const existingUserByEmail = await db.users.findOne({ email });

  if (existingUserByEmail) {
    const updated = await db.users.updateOne(
      { _id: existingUserByEmail._id },
      () => ({
        oauth: {
          google: {
            userId: googleUserId,
            connectedAt: new Date(),
          },
        },
      }),
    );

    await updateLastRequest({ userId: existingUserByEmail._id });
    return updated as User;
  }

  const newUser = await db.users.insertOne({
    firstName,
    lastName,
    email,
    isEmailVerified,
    avatarUrl,
    oauth: {
      google: {
        userId: googleUserId,
        connectedAt: new Date(),
      },
    },
  });

  return newUser as User;
}
