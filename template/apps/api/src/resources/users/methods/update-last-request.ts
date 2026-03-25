import db from '@/db';

export default function updateLastRequest({ userId }: { userId: string }) {
  return db.users.updateOne({ id: userId }, { lastRequest: new Date() });
}
