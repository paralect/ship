import { promises as fs } from 'fs';
import path from 'path';
import retry from 'async-retry';
import { cyan, green } from 'picocolors';
import gradient from 'gradient-string';

import { RepoInfo, PackageManager, Deployment } from 'types';
import { deploymentInstaller } from 'installers';
import {
  downloadAndExtractRepo,
  makeDir,
  tryGitInit,
  isFolderEmpty,
  isWriteable,
  getRepoInfo,
  isErrorLike,
  replaceTextInFile,
  install,
} from 'helpers';
import config from 'config';

import { HAPPY_CODING_TEXT, REPO_ISSUES_URL, REPO_URL, TEMPLATE_PATH } from 'app.constants';

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
  deployment: Deployment
}): Promise<void> => {
  const repoInfo: RepoInfo | undefined = await getRepoInfo(REPO_URL);

  if (!repoInfo) {
    console.error(`Repository with template not found, try again or report the issue here: ${cyan(REPO_ISSUES_URL)}`);

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

  try {
    await retry(() => downloadAndExtractRepo(root, repoInfo), { retries: 3 });
  } catch (reason) {
    throw new DownloadError(isErrorLike(reason) ? reason.message : `${reason}`);
  }

  const templatePath = path.join(root, repoInfo.name, TEMPLATE_PATH);

  await fs.cp(templatePath, root, { recursive: true });

  await replaceTextInFile(path.join(root, 'docker-compose.yml'), 'ship', projectName);

  const apiPath = path.join(root, 'apps/api');

  await fs.cp(path.join(apiPath, '.env.example'), path.join(apiPath, '.env'));

  await deploymentInstaller(deployment, {
    projectRoot: root,
    repoName: repoInfo.name,
    projectName,
  });

  await fs.rm(path.join(root, repoInfo.name), { recursive: true });

  console.log('Installing packages. This might take a couple of minutes.');
  console.log();

  const startInstallationTime = performance.now();

  await install(root, { packageManager });

  const endInstallationTime = performance.now();

  if (config.PNPM_SILENT) {
    console.log(`Done in ${Number((endInstallationTime - startInstallationTime) / 1000).toFixed(1)}s`);
  }

  console.log();

  if (tryGitInit(root, { packageManager })) {
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
