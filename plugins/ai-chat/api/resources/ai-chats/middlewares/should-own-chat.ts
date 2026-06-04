import db from '@/db';
import shouldOwn from '@/middlewares/should-own';

// Loads the current user's chat (by `chatId`, falling back to `id`) into `context.chat`,
// or throws NOT_FOUND. Apply with `.use(shouldOwnChat)` after `.input()`.
export default shouldOwn('chat', db.aiChats, { message: 'Chat not found' });
