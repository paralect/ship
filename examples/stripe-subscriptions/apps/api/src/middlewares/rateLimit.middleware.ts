import { rateLimitService } from 'services';

const LIMIT_DURATION = 1000 * 60; // 60 sec
const MAX_REQUESTS_PER_DURATION = 10;

const rateLimitMiddleware = rateLimitService(LIMIT_DURATION, MAX_REQUESTS_PER_DURATION);

export default rateLimitMiddleware;
