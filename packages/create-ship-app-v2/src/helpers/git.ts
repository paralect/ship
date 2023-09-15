import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const isInGitRepository = (): boolean => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });

    return true;
  } catch (_) {
    console.log('Something went wrong. Error code: IIGR');
    // ignore error
  }

  return false;
};

const isInMercurialRepository = (): boolean => {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (_) {
    // ignore error
  }
  return false;
};

const isDefaultBranchSet = (): boolean => {
  try {
    execSync('git config init.defaultBranch', { stdio: 'ignore' });
    return true;
  } catch (_) {
    // ignore error
  }
  return false;
};

export const tryGitInit = (root: string): boolean => {
  let didInit = false;

  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    if (!isDefaultBranchSet()) {
      execSync('git checkout -b main', { stdio: 'ignore' });
    }

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "init"', { stdio: 'ignore' });

    return true;
  } catch (e) {
    if (didInit) {
      try {
        fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
      } catch (_) {
        // ignore error
      }
    }
    return false;
  }
};
