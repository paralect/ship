import { existsSync } from 'fs';
import path from 'path';

import 'dotenv/config';

const truthy = (v: string | undefined, fallback: boolean) =>
  v === 'true' ? true : v === 'false' ? false : fallback;

/**
 * Auto-detect: when this binary lives inside a Ship monorepo (i.e. `template/`
 * exists relative to the bundle), default to USE_LOCAL_REPO=true so we don't
 * pull the old published template from GitHub during dev iteration.
 *
 * `__dirname` works under tsup's CJS output. From `dist/index.js`, the layout
 * we're checking for is `<repo>/packages/create-ship-app/dist/`, so the Ship
 * `template/` dir is at `../../../template`.
 */
function detectLocalCheckout(): boolean {
  try {
    const candidates = [
      path.resolve(__dirname, '../../../template'),
      path.resolve(__dirname, '../../template'),
    ];
    return candidates.some((p) => existsSync(p));
  } catch {
    return false;
  }
}

const config = {
  /** When true, the CLI copies the local Ship monorepo (next to this binary)
   *  instead of downloading `paralect/ship#main`. Auto-detected when running
   *  from a local checkout. Override via `USE_LOCAL_REPO=` env or `--local`. */
  USE_LOCAL_REPO: truthy(process.env.USE_LOCAL_REPO, detectLocalCheckout()),
  USE_TEMP_DIR: truthy(process.env.USE_TEMP_DIR, false),
  TEMP_DIR_PATH: process.env.TEMP_DIR_PATH,
  CLEANUP_TEMP_DIR: truthy(process.env.CLEANUP_TEMP_DIR, false),
  PNPM_SILENT: truthy(process.env.PNPM_SILENT, false),
  PLUGINS_REPO_OWNER: process.env.PLUGINS_REPO_OWNER || 'paralect',
  PLUGINS_REPO_NAME: process.env.PLUGINS_REPO_NAME || 'ship-plugins',
};

export default config;
