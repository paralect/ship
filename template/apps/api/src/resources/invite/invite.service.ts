import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './invite.schema';
import { Invite } from './invite.types';

const service = db.createService<Invite>(DATABASE_DOCUMENTS.INVITES, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

export default Object.assign(service, {});
