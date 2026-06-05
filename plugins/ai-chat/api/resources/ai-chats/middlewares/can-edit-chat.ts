import db from '@/db';
import canEdit from '@/middlewares/can-edit';

export default canEdit('chat', db.aiChats, { message: 'Chat not found' });
