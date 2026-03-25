import { eq } from 'drizzle-orm';

import { db, users } from '@/db';

export default function updateLastRequest(id: string) {
  return db.update(users).set({ lastRequest: new Date() }).where(eq(users.id, id));
}
