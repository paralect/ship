// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';

const config = {
  IS_DEV: process.env.IS_DEV === 'true' || false,
  USE_TEMP_DIR: process.env.USE_TEMP_DIR === 'true' || false,
  TEMP_DIR_PATH: process.env.TEMP_DIR_PATH,
  REMOVE_TEMP_DIR: process.env.REMOVE_TEMP_DIR === 'true' || false,
};

export default config;
