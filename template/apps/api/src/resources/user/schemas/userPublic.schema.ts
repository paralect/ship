import { privateFields } from '../user.service';
import schema from '../user.schema';
import { docsService } from 'services';

const transformedPrivateFields = privateFields.reduce<{ [key: string]: boolean }>((acc, curr) => {
  acc[curr] = true;
  return acc;
}, {});

export const UserPublicSchema = schema.omit(transformedPrivateFields);
docsService.registerSchema('UserPublic', UserPublicSchema);
