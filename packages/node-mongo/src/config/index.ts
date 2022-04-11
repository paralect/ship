/* eslint-disable global-require */
import * as _ from 'lodash';

export interface Config {
  env: string,
  mongo: {
    connection: string;
    dbName?: string;
  };
}

const env = 'test';
// eslint-disable-next-line
let base: Config = {
  env,
  mongo: {
    connection: process.env.TEST_MONGO_URL || 'mongodb://root:root@mongo/node-mongo-tests?authSource=admin&replicaSet=rs',
    dbName: 'node-mongo-tests',
  },
};

export const load = (): Config => {
  let resultConfig = base;

  let localConfig = { default: {} };
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    localConfig = require('./local');
    resultConfig = _.merge(resultConfig, localConfig.default);
  // eslint-disable-next-line no-empty
  } catch {}

  return resultConfig;
};

base = load();

export default base;
