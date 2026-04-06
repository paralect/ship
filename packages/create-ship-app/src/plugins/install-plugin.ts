import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import { bold, cyan, green, red, yellow } from 'picocolors';

import config from 'config';

import { downloadPlugin, type DownloadedPlugin, type PluginManifest } from './download';

const resolveProjectRoot = (): string => {
  let cwd = process.cwd();

  if (config.USE_LOCAL_REPO) {
    cwd = path.join(cwd, '..', '..', 'template');
  }

  return cwd;
};

const copyFiles = (root: string, files: DownloadedPlugin['files']): void => {
  for (const file of files) {
    const fullPath = path.join(root, file.relativePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(fullPath)) {
      console.log(yellow(`  ⚠ File already exists, skipping: ${file.relativePath}`));
      continue;
    }

    fs.writeFileSync(fullPath, file.content, 'utf8');
    console.log(green(`  ✓ Created ${file.relativePath}`));
  }
};

const mergeDependencies = (root: string, manifest: PluginManifest): void => {
  const deps = manifest.dependencies;

  if (!deps) return;

  for (const [workspace, packages] of Object.entries(deps)) {
    const pkgPath = path.join(root, workspace, 'package.json');

    if (!fs.existsSync(pkgPath)) {
      console.log(red(`  ✗ Package.json not found: ${workspace}/package.json`));
      continue;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }

    for (const [name, version] of Object.entries(packages)) {
      if (pkg.dependencies[name]) {
        console.log(yellow(`  ⚠ Dependency already exists: ${name} in ${workspace}`));
        continue;
      }

      pkg.dependencies[name] = version;
      console.log(green(`  ✓ Added ${name}@${version} to ${workspace}/package.json`));
    }

    pkg.dependencies = Object.fromEntries(
      Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
    );

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  }
};

const runCommand = (cwd: string, command: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');

    const child = spawn(cmd, args, { stdio: 'inherit', cwd });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed: ${command}`));
        return;
      }

      resolve();
    });
  });

export const installPlugin = async (pluginName: string): Promise<void> => {
  const root = resolveProjectRoot();

  console.log();
  console.log(bold(`Installing plugin: ${cyan(pluginName)}`));
  console.log();

  // 1. Download plugin from GitHub
  console.log(bold('Downloading plugin...'));

  let plugin: DownloadedPlugin;

  try {
    plugin = await downloadPlugin(pluginName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(red(`\n  ✗ Failed to download plugin "${pluginName}": ${message}`));
    console.log(red('    Make sure the plugin name is correct and you have internet access.\n'));
    process.exit(1);
  }

  if (plugin.files.length === 0) {
    console.log(red(`\n  ✗ Plugin "${pluginName}" contains no files.\n`));
    process.exit(1);
  }

  console.log(green(`  ✓ Downloaded ${plugin.files.length} files\n`));

  // 2. Copy files to project
  console.log(bold('Creating files...'));
  copyFiles(root, plugin.files);

  // 3. Merge dependencies
  if (plugin.manifest?.dependencies && Object.keys(plugin.manifest.dependencies).length > 0) {
    console.log(bold('\nAdding dependencies...'));
    mergeDependencies(root, plugin.manifest);
  }

  // 4. Post-install: install deps + regenerate shared schemas
  console.log(bold('\nRunning post-install...'));

  console.log(cyan('  $ pnpm install'));
  await runCommand(root, 'pnpm install');

  console.log(cyan('  $ pnpm run --filter shared generate'));
  await runCommand(root, 'pnpm run --filter shared generate');

  console.log(bold(green(`\n✓ Plugin "${pluginName}" installed successfully!\n`)));
};
