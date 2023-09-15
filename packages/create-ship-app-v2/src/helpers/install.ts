/* eslint-disable import/no-extraneous-dependencies */
import { yellow } from 'picocolors';
import spawn from 'cross-spawn';
import type { PackageManager } from '../types';

interface InstallArgs {
  /**
   * Indicate whether to install packages using npm, pnpm or Yarn.
   */
  packageManager: PackageManager
  /**
   * Indicate whether there is an active Internet connection.
   */
  isOnline: boolean
}

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export const install = (
  root: string,
  { packageManager, isOnline }: InstallArgs,
): Promise<void> => new Promise((resolve, reject) => {
  const args: string[] = ['install', '--prefer-frozen-lockfile', '--ignore-scripts'];
  const command = packageManager;

  if (!isOnline) {
    console.log(yellow('You appear to be offline.'));
    console.log();
  }

  const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      PORT: undefined,
      ADBLOCK: '1',
      // we set NODE_ENV to development as pnpm skips dev
      // dependencies when production
      NODE_ENV: 'development',
      DISABLE_OPENCOLLECTIVE: '1',
    },
  });

  child.on('close', (code) => {
    if (code !== 0) {
      const error = { command: `${command} ${args.join(' ')}` };

      reject(new Error(JSON.stringify(error)));

      return;
    }
    resolve();
  });
});
