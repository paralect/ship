import rateLimiter from 'services/rateLimit.service';
import { RATE_LIMIT } from 'app.constants';

const rateLimitMiddleware = rateLimiter(1000 * 60, RATE_LIMIT.MINUTE);

export default rateLimitMiddleware;
