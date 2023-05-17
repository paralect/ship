import { docsService } from 'services';

import { privateFields } from '../user.service';
import schema from '../user.schema';

const transformedPrivateFields = privateFields.reduce<{ [key: string]: boolean }>((acc, curr) => {
  acc[curr] = true;
  return acc;
}, {});

export const UserPublicSchema = docsService.registerSchema(
  'UserPublic',
  schema.omit(transformedPrivateFields),
);
