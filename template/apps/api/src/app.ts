/* eslint-disable antfu/no-top-level-await */
import './resources/users/handlers/sync-analytics';
import './resources/users/handlers/to-sockets';

const { default: app } = await import('server');

export default app;
