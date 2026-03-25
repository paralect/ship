import db from '@/db';

export default function updateLastRequest(id: string) {
  return db.users.updateOne({ id }, { lastRequest: new Date() });
}
