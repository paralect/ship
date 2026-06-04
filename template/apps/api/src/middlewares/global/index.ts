import logger from '@/middlewares/global/logger';

// Global middlewares applied to every endpoint (in order), before any per-endpoint `.use(...)`.
// Register a new always-on middleware here — `endpoint.ts` applies the whole list automatically.
// These must be context-preserving (cross-cutting side effects: logging, timing, request-id).
const globalMiddlewares = [logger];

export default globalMiddlewares;
