import { cyan, yellow } from 'picocolors';
import spawn from 'cross-spawn';
import * as util from 'util';
import prompts from 'prompts';
import { exec } from 'child_process';

import type { PackageManager } from 'types';

import { preCommitHooksInstaller } from 'installers';

import config from 'config';

import { getOnline } from './is-online';
import { onPromptState } from './common';

const execAsync = util.promisify(exec);

interface InstallArgs {
  packageManager: PackageManager
}

export const install = async (
  root: string,
  { packageManager }: InstallArgs,
): Promise<void> => {
  let isPnpmInstalled: boolean;

  try {
    const { stdout } = await execAsync('pnpm --version');

    isPnpmInstalled = stdout !== undefined;
  } catch (error) {
    isPnpmInstalled = false;
  }

  if (!isPnpmInstalled) {
    const res = await prompts({
      onState: onPromptState,
      type: 'confirm',
      name: 'builtin',
      message: `The ${cyan('pnpm')} package manager is not installed. Do you want to install latest version now?`,
      initial: true,
    });

    if (!res.builtin) {
      console.error(`Ship requires ${cyan('pnpm')} to run, install it and try again.`);
      console.log();

      process.exit(1);
    }

    try {
      await execAsync('npm install -g pnpm');
    } catch (error) {
      console.error('Something went wrong while installing pnpm, please try again later.');
    }
  }

  const isOnline = await getOnline();

  preCommitHooksInstaller(root);

  return new Promise((resolve, reject) => {
    const args: string[] = ['install', '--prefer-frozen-lockfile', '--ignore-scripts'];
    const command = packageManager;

    if (config.PNPM_SILENT) {
      args.push('--silent');
    }

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
};
