import 'dotenv/config';

const config = {
  USE_LOCAL_REPO: process.env.USE_LOCAL_REPO === 'true' || false,
  USE_TEMP_DIR: process.env.USE_TEMP_DIR === 'true' || false,
  TEMP_DIR_PATH: process.env.TEMP_DIR_PATH,
  CLEANUP_TEMP_DIR: process.env.CLEANUP_TEMP_DIR === 'true' || false,
  PNPM_SILENT: process.env.PNPM_SILENT === 'true' || false,
};

export default config;
