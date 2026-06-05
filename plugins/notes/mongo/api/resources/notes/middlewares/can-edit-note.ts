import db from '@/db';
import canEdit from '@/middlewares/can-edit';

export default canEdit('note', db.notes, { message: 'Note not found' });
