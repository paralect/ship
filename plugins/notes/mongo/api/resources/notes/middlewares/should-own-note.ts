import db from '@/db';
import shouldOwn from '@/middlewares/should-own';

// Loads the current user's note (by `id`) into `context.note`, or throws NOT_FOUND.
// Apply with `.use(shouldOwnNote)` after `.input()`.
export default shouldOwn('note', db.notes, { message: 'Note not found' });
