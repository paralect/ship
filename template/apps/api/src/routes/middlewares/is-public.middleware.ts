import { createMiddleware } from 'routes/types';

export const isPublic = createMiddleware(async (_ctx, next) => next());

export default isPublic;
