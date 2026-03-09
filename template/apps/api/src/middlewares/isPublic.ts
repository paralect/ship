import createMiddleware from 'routes/createMiddleware';

export const isPublic = createMiddleware(async (_ctx, next) => next());

export default isPublic;
