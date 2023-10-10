import { docsService } from 'services';
import { z } from 'zod';

export const EmptySchema = docsService.registerSchema('EmptyObject', z.object({}));
