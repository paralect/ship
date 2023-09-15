/* eslint-disable import/no-extraneous-dependencies */
import retry from 'async-retry';
import { cyan, green } from 'picocolors';
import gradient from 'gradient-string';
import path from 'path';
import { promises as fs } from 'fs';

import { downloadAndExtractRepo, getRepoInfo, RepoInfo } from './helpers/source-repository';
import { makeDir } from './helpers/make-dir';
import { tryGitInit } from './helpers/git';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { isWriteable } from './helpers/is-writeable';
import type { PackageManager } from './types';

import { DEPLOYMENT } from './enums';
import { isErrorLike, replaceTextInFile } from './helpers/common';
import { HAPPY_CODING_TEXT, TEMPLATE_PATH } from './constants/common';
import { deploymentInstaller } from './installers/deployment';

const repoUrl: URL = new URL('https://github.com/paralect/ship');
const issuesURL = `${repoUrl.href}/issues`;

export class DownloadError extends Error {}

export const createApp = async ({
  projectName,
  appPath,
  deployment,
  packageManager = 'pnpm',
}: {
  projectName: string
  appPath: string
  packageManager?: PackageManager
  deployment: DEPLOYMENT
}): Promise<void> => {
  const repoInfo: RepoInfo | undefined = await getRepoInfo(repoUrl);

  if (!repoInfo) {
    console.error(`Repository with template not found, try again or report the issue here: ${cyan(issuesURL)}`);

    process.exit(1);
  }

  const root = path.resolve(appPath);
  const isApplicationPathWritable = await isWriteable(path.dirname(root));

  if (!isApplicationPathWritable) {
    console.error('The application path is not writable, please check folder path or permissions and try again.');

    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);

  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const originalDirectory = process.cwd();

  console.log(`Creating a new Ship app in ${green(root)}.`);
  console.log();

  process.chdir(root);

  console.log('Downloading repository from GitHub...');
  console.log();

  try {
    await retry(() => downloadAndExtractRepo(root, repoInfo), { retries: 3 });
  } catch (reason) {
    throw new DownloadError(isErrorLike(reason) ? reason.message : `${reason}`);
  }

  const templatePath = path.join(root, repoInfo.name, TEMPLATE_PATH);

  await fs.cp(templatePath, root, { recursive: true });

  await replaceTextInFile(path.join(root, 'docker-compose.yml'), 'ship', projectName);

  await deploymentInstaller(deployment, {
    projectRoot: root,
    repoName: repoInfo.name,
    projectName,
  });

  // await fs.rm(path.join(root, repoInfo.name), { recursive: true });

  // console.log('Installing packages. This might take a couple of minutes.');
  // console.log();

  // const isOnline = await getOnline();

  // await install(root, { packageManager, isOnline });

  // console.log();

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.');
    console.log();
  } else {
    console.log('Did not initialize the git repository.');
    console.log();
  }

  let cdPath: string;

  if (path.join(originalDirectory, appName) === appPath) {
    cdPath = appName;
  } else {
    cdPath = appPath;
  }

  console.log(`${gradient.pastel.multiline(HAPPY_CODING_TEXT)}\n`);
  console.log(`${green('Success!')} Created ${appName} at ${green(appPath)}`);
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(cyan('  cd'), cdPath);
  console.log(`  ${cyan(`${packageManager} run start`)}`);
  console.log();
};
