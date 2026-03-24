/* eslint-disable antfu/no-top-level-await */
import init from 'initDb';

await init();

const { default: app } = await import('server');

export default app;
