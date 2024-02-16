import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const removeFirstLine = (filePath: string): void => {
  try {
    const content = readFileSync(filePath, { encoding: 'utf-8' });

    const modifiedContent = content.split('\n').slice(1).join('\n');

    writeFileSync(filePath, modifiedContent, { encoding: 'utf-8' });
  } catch (error) {
    console.error(`Error removing the first line in file ${filePath}:`, error);
  }
};

export const preCommitHooksInstaller = (root : string) => {
  execSync('npm pkg set scripts.prepare="husky"');

  removeFirstLine(path.join(root, '.husky/pre-commit'));
};
