import db from '@/db';

export default function updateLastRequest(_id: string) {
  return db.users.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
}
