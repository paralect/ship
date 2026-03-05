import { execSync } from 'child_process';
import fs from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { bold, cyan, green, red, yellow } from 'picocolors';

import config from 'config';

interface PackageJsonDiff {
  /** Workspace path like "apps/api" */
  workspace: string;
  /** Added dependencies: name → version */
  added: Record<string, string>;
}

const IGNORED_FILES = [
  'pnpm-lock.yaml',
  'packages/shared/src/generated/',
  'packages/shared/src/schemas/',
];

const shouldIgnoreFile = (filePath: string): boolean =>
  IGNORED_FILES.some((pattern) => filePath.includes(pattern));

const isWorkspacePackageJson = (filePath: string): boolean =>
  /^apps\/[^/]+\/package\.json$/.test(filePath);

const git = (args: string, cwd: string): string =>
  execSync(`git ${args}`, { cwd, encoding: 'utf8' }).trim();

/**
 * Get the path prefix from git root to the project root.
 * E.g. if git root is /monorepo and cwd is /monorepo/template, returns "template/".
 * If cwd IS the git root, returns "".
 */
const getGitPrefix = (projectRoot: string): string => {
  const prefix = git('rev-parse --show-prefix', projectRoot);

  return prefix; // already has trailing slash if non-empty
};

/**
 * Strip prefix and normalize a path from git diff output.
 * E.g. "template/apps/api/src/foo.ts" with prefix "template/" → "apps/api/src/foo.ts"
 */
const stripPrefix = (filePath: string, prefix: string): string =>
  prefix && filePath.startsWith(prefix) ? filePath.slice(prefix.length) : filePath;

/**
 * Get new files from the last commit (status A = added).
 * Excludes package.json diffs, lock files, and generated files.
 */
const getNewFiles = (projectRoot: string): string[] => {
  const prefix = getGitPrefix(projectRoot);
  const output = git('diff --name-status HEAD~1 HEAD', projectRoot);

  return output
    .split('\n')
    .filter((line) => line.startsWith('A\t'))
    .map((line) => stripPrefix(line.slice(2), prefix))
    .filter((file) => !shouldIgnoreFile(file) && !isWorkspacePackageJson(file) && file !== 'package.json');
};

/**
 * Extract added dependencies from modified workspace package.json files.
 * Compares HEAD~1 vs HEAD to find new deps.
 */
const getPackageJsonDiffs = (projectRoot: string): PackageJsonDiff[] => {
  const prefix = getGitPrefix(projectRoot);
  const output = git('diff --name-status HEAD~1 HEAD', projectRoot);
  const diffs: PackageJsonDiff[] = [];

  const modifiedPackageJsons = output
    .split('\n')
    .filter((line) => line.startsWith('M\t'))
    .map((line) => {
      const gitPath = line.slice(2);
      return { gitPath, localPath: stripPrefix(gitPath, prefix) };
    })
    .filter(({ localPath }) => isWorkspacePackageJson(localPath));

  for (const { gitPath, localPath } of modifiedPackageJsons) {
    const workspace = path.dirname(localPath);

    let oldPkg: Record<string, string>;
    let newPkg: Record<string, string>;

    try {
      oldPkg = JSON.parse(git(`show HEAD~1:${gitPath}`, projectRoot)).dependencies || {};
      newPkg = JSON.parse(git(`show HEAD:${gitPath}`, projectRoot)).dependencies || {};
    } catch {
      continue;
    }

    const added: Record<string, string> = {};

    for (const [name, version] of Object.entries(newPkg)) {
      if (!oldPkg[name]) {
        added[name] = version;
      }
    }

    if (Object.keys(added).length > 0) {
      diffs.push({ workspace, added });
    }
  }

  return diffs;
};

/**
 * Build plugin package.json with dependency map.
 */
const buildPluginManifest = (pluginName: string, diffs: PackageJsonDiff[]): string => {
  const manifest: Record<string, unknown> = {
    name: `ship-plugin-${pluginName}`,
    version: '1.0.0',
    private: true,
  };

  if (diffs.length > 0) {
    const dependencies: Record<string, Record<string, string>> = {};

    for (const diff of diffs) {
      dependencies[diff.workspace] = diff.added;
    }

    manifest.dependencies = dependencies;
  }

  return JSON.stringify(manifest, null, 2) + '\n';
};

/**
 * Clone the plugins repo, create a branch with the plugin files, and push.
 */
const pushToPluginsRepo = (pluginName: string, pluginDir: string): string => {
  const owner = config.PLUGINS_REPO_OWNER;
  const repo = config.PLUGINS_REPO_NAME;
  const repoUrl = `git@github.com:${owner}/${repo}.git`;
  const branch = `add/${pluginName}`;

  const tempDir = path.join(tmpdir(), `ship-plugin-${Date.now()}`);

  console.log(cyan(`  Cloning ${owner}/${repo}...`));
  execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`, { stdio: 'pipe' });

  console.log(cyan(`  Creating branch ${branch}...`));
  execSync(`git checkout -b ${branch}`, { cwd: tempDir, stdio: 'pipe' });

  // Copy plugin directory into the repo
  const destDir = path.join(tempDir, pluginName);
  fs.cpSync(pluginDir, destDir, { recursive: true });

  execSync('git add .', { cwd: tempDir, stdio: 'pipe' });
  execSync(`git commit -m "Add ${pluginName} plugin"`, { cwd: tempDir, stdio: 'pipe' });

  console.log(cyan(`  Pushing to ${owner}/${repo}...`));
  execSync(`git push origin ${branch}`, { cwd: tempDir, stdio: 'pipe' });

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });

  return `https://github.com/${owner}/${repo}/compare/main...${branch}?expand=1`;
};

export const createPlugin = async (pluginName: string): Promise<void> => {
  const projectRoot = process.cwd();

  console.log();
  console.log(bold(`Creating plugin: ${cyan(pluginName)}`));
  console.log();

  // 1. Extract new files from last commit
  console.log(bold('Extracting files from last commit...'));

  const newFiles = getNewFiles(projectRoot);

  if (newFiles.length === 0) {
    console.log(red('\n  ✗ No new files found in the last commit.\n'));
    process.exit(1);
  }

  for (const file of newFiles) {
    console.log(green(`  ✓ ${file}`));
  }

  // 2. Extract dependency diffs
  console.log(bold('\nExtracting dependency changes...'));

  const depDiffs = getPackageJsonDiffs(projectRoot);

  if (depDiffs.length === 0) {
    console.log(yellow('  No new dependencies found.'));
  } else {
    for (const diff of depDiffs) {
      for (const [name, version] of Object.entries(diff.added)) {
        console.log(green(`  ✓ ${name}@${version} → ${diff.workspace}`));
      }
    }
  }

  // 3. Build plugin directory in temp location
  console.log(bold('\nPackaging plugin...'));

  const pluginDir = path.join(tmpdir(), `ship-plugin-build-${Date.now()}`, pluginName);
  fs.mkdirSync(pluginDir, { recursive: true });

  // Copy new files preserving directory structure
  for (const file of newFiles) {
    const src = path.join(projectRoot, file);
    const dest = path.join(pluginDir, file);

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  // Write plugin package.json
  const manifest = buildPluginManifest(pluginName, depDiffs);
  fs.writeFileSync(path.join(pluginDir, 'package.json'), manifest, 'utf8');

  console.log(green(`  ✓ Packaged ${newFiles.length} files + package.json`));

  // 4. Push to plugins repo
  console.log(bold('\nPushing to plugins repository...'));

  try {
    const prUrl = pushToPluginsRepo(pluginName, pluginDir);

    // Cleanup build dir
    fs.rmSync(path.dirname(pluginDir), { recursive: true, force: true });

    console.log(bold(green(`\n✓ Plugin "${pluginName}" pushed successfully!\n`)));
    console.log(`Create a pull request: ${cyan(prUrl)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(red(`\n  ✗ Failed to push: ${message}`));
    console.log(yellow('  Make sure you have push access to the plugins repository.\n'));

    // Still show the local build path
    console.log(`  Plugin files are at: ${cyan(pluginDir)}\n`);
    process.exit(1);
  }
};
