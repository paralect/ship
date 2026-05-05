import db from '@/db';

export default function updateLastRequest({ userId }: { userId: string }) {
  return db.users.atomic.updateOne(
    { _id: userId },
    {
      $set: {
        lastRequestAt: new Date(),
      },
    },
  );
}
