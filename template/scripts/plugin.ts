import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, unlinkSync, watch, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const API_RESOURCES = join(ROOT, 'apps', 'api', 'src', 'resources');
const WEB_PAGES = join(ROOT, 'apps', 'web', 'src', 'pages');
const LOCK_PATH = join(ROOT, 'plugins.lock.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

interface PluginJson {
  name: string;
  version?: string;
  description?: string;
  resources?: string[];
  pages?: string[];
  dependencies?: {
    api?: Record<string, string>;
    web?: Record<string, string>;
  };
}

interface LockEntry {
  url: string;
  commit: string;
  installedAt: string;
  version: string;
  files: string[];
  dependencies?: {
    api?: string[];
    web?: string[];
  };
}

type LockFile = Record<string, LockEntry>;

function readLock(): LockFile {
  if (!existsSync(LOCK_PATH)) return {};
  return JSON.parse(readFileSync(LOCK_PATH, 'utf-8'));
}

function writeLock(lock: LockFile): void {
  writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + '\n');
}

function collectFiles(dir: string, base: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

function exec(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

// ── Install ──────────────────────────────────────────────────────────────────

function install(source: string): void {
  const tmpDir = join(ROOT, '.plugin-tmp-' + Date.now());

  try {
    // Clone
    console.log(`Cloning ${source}...`);
    execSync(`git clone --depth 1 ${source} ${tmpDir}`, { stdio: 'inherit' });

    const pluginJsonPath = join(tmpDir, 'plugin.json');
    if (!existsSync(pluginJsonPath)) {
      throw new Error('plugin.json not found in repository');
    }

    const plugin: PluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    if (!plugin.name) throw new Error('plugin.json must have a "name" field');

    const lock = readLock();

    // Check for conflicts (skip if updating same plugin)
    const apiResourcesDir = join(tmpDir, 'api', 'resources');
    const webPagesDir = join(tmpDir, 'web', 'pages');

    const hasApi = existsSync(apiResourcesDir);
    const hasWeb = existsSync(webPagesDir);

    if (!hasApi && !hasWeb) {
      throw new Error('Plugin has no api/resources/ or web/pages/ directories');
    }

    // Detect resource/page names from actual directories
    const resourceNames = hasApi
      ? readdirSync(apiResourcesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
      : [];
    const pageNames = hasWeb
      ? readdirSync(webPagesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
      : [];

    // Conflict check
    for (const name of resourceNames) {
      const target = join(API_RESOURCES, name);
      if (existsSync(target) && lock[plugin.name]?.files?.some((f) => f.includes(`resources/${name}/`)) !== true) {
        throw new Error(`Resource "${name}" already exists. Remove it first or use a different name.`);
      }
    }
    for (const name of pageNames) {
      const target = join(WEB_PAGES, name);
      if (existsSync(target) && lock[plugin.name]?.files?.some((f) => f.includes(`pages/${name}/`)) !== true) {
        throw new Error(`Page "${name}" already exists. Remove it first or use a different name.`);
      }
    }

    // If updating, remove old files first
    if (lock[plugin.name]) {
      console.log(`Updating existing plugin "${plugin.name}", removing old files...`);
      removePluginFiles(lock[plugin.name]);
    }

    const trackedFiles: string[] = [];

    // Copy API resources
    if (hasApi) {
      for (const name of resourceNames) {
        const src = join(apiResourcesDir, name);
        const dest = join(API_RESOURCES, name);
        console.log(`  Copying api/resources/${name}/`);
        cpSync(src, dest, { recursive: true });
        trackedFiles.push(...collectFiles(dest, `apps/api/src/resources/${name}`));
      }
    }

    // Copy web pages
    if (hasWeb) {
      for (const name of pageNames) {
        const src = join(webPagesDir, name);
        const dest = join(WEB_PAGES, name);
        console.log(`  Copying web/pages/${name}/`);
        cpSync(src, dest, { recursive: true });
        trackedFiles.push(...collectFiles(dest, `apps/web/src/pages/${name}`));
      }
    }

    // Copy root-level API files (e.g. server-config.ts)
    const apiDir = join(tmpDir, 'api');
    if (existsSync(apiDir)) {
      const apiSrc = join(ROOT, 'apps', 'api', 'src');
      for (const file of readdirSync(apiDir)) {
        if (!file.endsWith('.ts')) continue;
        const dest = join(apiSrc, file);
        cpSync(join(apiDir, file), dest);
        trackedFiles.push(`apps/api/src/${file}`);
        console.log(`  Copying api/${file}`);
      }
    }

    // Install dependencies
    const depEntries: LockEntry['dependencies'] = {};
    if (plugin.dependencies?.api && Object.keys(plugin.dependencies.api).length > 0) {
      const pkgs = Object.entries(plugin.dependencies.api).map(([k, v]) => `${k}@${v}`);
      console.log(`  Installing API dependencies: ${pkgs.join(', ')}`);
      execSync(`pnpm add ${pkgs.join(' ')} --filter api`, { cwd: ROOT, stdio: 'inherit' });
      depEntries.api = pkgs;
    }
    if (plugin.dependencies?.web && Object.keys(plugin.dependencies.web).length > 0) {
      const pkgs = Object.entries(plugin.dependencies.web).map(([k, v]) => `${k}@${v}`);
      console.log(`  Installing web dependencies: ${pkgs.join(', ')}`);
      execSync(`pnpm add ${pkgs.join(' ')} --filter web`, { cwd: ROOT, stdio: 'inherit' });
      depEntries.web = pkgs;
    }

    // Run codegen so router.ts picks up new endpoints
    if (hasApi && resourceNames.some((n) => existsSync(join(API_RESOURCES, n, 'endpoints')))) {
      console.log('  Running API codegen...');
      execSync('pnpm --filter api codegen', { cwd: ROOT, stdio: 'inherit' });
    }

    // Get commit hash
    let commit = 'unknown';
    try {
      commit = exec(`git -C ${tmpDir} rev-parse HEAD`);
    } catch {}

    // Update lock
    lock[plugin.name] = {
      url: source,
      commit,
      installedAt: new Date().toISOString(),
      version: plugin.version || '0.0.0',
      files: trackedFiles,
      ...(Object.keys(depEntries).length > 0 ? { dependencies: depEntries } : {}),
    };
    writeLock(lock);

    console.log(`\nInstalled plugin "${plugin.name}":`);
    if (resourceNames.length) console.log(`  Resources: ${resourceNames.join(', ')}`);
    if (pageNames.length) console.log(`  Pages: ${pageNames.join(', ')}`);
    console.log(`  Files: ${trackedFiles.length} total`);
  } finally {
    if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ── Uninstall ────────────────────────────────────────────────────────────────

function removePluginFiles(entry: LockEntry): void {
  const dirsToCheck = new Set<string>();

  for (const relPath of entry.files) {
    const absPath = join(ROOT, relPath);
    if (existsSync(absPath)) {
      rmSync(absPath);
      dirsToCheck.add(resolve(absPath, '..'));
    }
  }

  // Remove empty directories (bottom-up)
  const sortedDirs = [...dirsToCheck].sort((a, b) => b.length - a.length);
  for (const dir of sortedDirs) {
    try {
      const contents = readdirSync(dir);
      if (contents.length === 0) rmSync(dir, { recursive: true });
    } catch {}
  }
}

function uninstall(pluginName: string): void {
  const lock = readLock();
  const entry = lock[pluginName];
  if (!entry) {
    console.error(`Plugin "${pluginName}" is not installed.`);
    process.exit(1);
  }

  console.log(`Uninstalling plugin "${pluginName}"...`);
  removePluginFiles(entry);

  // Remove dependencies (only if not used by other plugins)
  const otherDeps = new Set<string>();
  for (const [name, other] of Object.entries(lock)) {
    if (name === pluginName) continue;
    for (const pkg of other.dependencies?.api || []) otherDeps.add(pkg.split('@')[0]);
    for (const pkg of other.dependencies?.web || []) otherDeps.add(pkg.split('@')[0]);
  }

  if (entry.dependencies?.api) {
    const toRemove = entry.dependencies.api
      .map((p) => p.split('@')[0])
      .filter((p) => !otherDeps.has(p));
    if (toRemove.length) {
      console.log(`  Removing API dependencies: ${toRemove.join(', ')}`);
      try { execSync(`pnpm remove ${toRemove.join(' ')} --filter api`, { cwd: ROOT, stdio: 'inherit' }); } catch {}
    }
  }
  if (entry.dependencies?.web) {
    const toRemove = entry.dependencies.web
      .map((p) => p.split('@')[0])
      .filter((p) => !otherDeps.has(p));
    if (toRemove.length) {
      console.log(`  Removing web dependencies: ${toRemove.join(', ')}`);
      try { execSync(`pnpm remove ${toRemove.join(' ')} --filter web`, { cwd: ROOT, stdio: 'inherit' }); } catch {}
    }
  }

  // Re-run codegen
  console.log('  Running API codegen...');
  try { execSync('pnpm --filter api codegen', { cwd: ROOT, stdio: 'inherit' }); } catch {}

  delete lock[pluginName];
  writeLock(lock);

  console.log(`Plugin "${pluginName}" uninstalled.`);
}

// ── List ─────────────────────────────────────────────────────────────────────

function list(): void {
  const lock = readLock();
  const names = Object.keys(lock);
  if (names.length === 0) {
    console.log('No plugins installed.');
    return;
  }
  console.log('Installed plugins:\n');
  for (const [name, entry] of Object.entries(lock)) {
    console.log(`  ${name} v${entry.version}`);
    console.log(`    Source: ${entry.url}`);
    console.log(`    Commit: ${entry.commit.slice(0, 8)}`);
    console.log(`    Files:  ${entry.files.length}`);
    console.log(`    Date:   ${entry.installedAt}`);
    console.log();
  }
}

// ── Dev ──────────────────────────────────────────────────────────────────────

// ── Dev ──────────────────────────────────────────────────────────────────────

const PLUGIN_TEST_DIR = join(ROOT, 'plugin-dev-server');

function copyTemplateToPluginTest(): void {
  if (existsSync(PLUGIN_TEST_DIR)) rmSync(PLUGIN_TEST_DIR, { recursive: true });

  // Copy the template apps and packages (not node_modules, not .git, not plugin-dev-server itself)
  const dirsToLink = ['apps', 'packages', 'bin'];
  const filesToCopy = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml', 'turbo.json', '.env'];

  mkdirSync(PLUGIN_TEST_DIR, { recursive: true });

  // Symlink heavy dirs (node_modules-dependent) so we don't duplicate installs
  for (const dir of dirsToLink) {
    const src = join(ROOT, dir);
    if (existsSync(src)) {
      cpSync(src, join(PLUGIN_TEST_DIR, dir), { recursive: true, filter: (s) => !s.includes('node_modules') });
    }
  }

  // Copy config files
  for (const file of filesToCopy) {
    const src = join(ROOT, file);
    if (existsSync(src)) cpSync(src, join(PLUGIN_TEST_DIR, file));
  }

}

function mergePluginFiles(absPath: string): void {
  const destApi = join(PLUGIN_TEST_DIR, 'apps', 'api');

  // api/src/resources/* → apps/api/src/resources/
  const apiResourcesDir = join(absPath, 'api', 'src', 'resources');
  // Also support legacy api/resources/ for backwards compat
  const apiResourcesLegacy = join(absPath, 'api', 'resources');
  for (const srcDir of [apiResourcesDir, apiResourcesLegacy]) {
    if (!existsSync(srcDir)) continue;
    for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
      if (!entry.isDirectory() && !entry.name.endsWith('.ts')) continue;
      const target = join(destApi, 'src', 'resources', entry.name);
      cpSync(join(srcDir, entry.name), target, { recursive: entry.isDirectory() });
      console.log(`  Merged resources/${entry.name}`);
    }
  }

  // api/src/*.ts → apps/api/src/ (e.g. db.service.ts, server-config.ts, admin-set.ts)
  const apiSrcDir = join(absPath, 'api', 'src');
  if (existsSync(apiSrcDir)) {
    for (const file of readdirSync(apiSrcDir)) {
      if (!file.endsWith('.ts') || file === 'resources') continue;
      cpSync(join(apiSrcDir, file), join(destApi, 'src', file));
      console.log(`  Copied src/${file}`);
    }
  }

  // Also support legacy api/*.ts (server-config.ts at api/ root)
  const apiRoot = join(absPath, 'api');
  if (existsSync(apiRoot)) {
    for (const file of readdirSync(apiRoot)) {
      if (!file.endsWith('.ts')) continue;
      cpSync(join(apiRoot, file), join(destApi, 'src', file));
      console.log(`  Copied api/${file}`);
    }
  }

  // api/scripts/* → apps/api/scripts/
  const apiScriptsDir = join(absPath, 'api', 'scripts');
  if (existsSync(apiScriptsDir)) {
    const destScripts = join(destApi, 'scripts');
    for (const file of readdirSync(apiScriptsDir)) {
      cpSync(join(apiScriptsDir, file), join(destScripts, file));
      console.log(`  Copied scripts/${file}`);
    }
  }

  // api/drizzle.config.ts (and other root config files) → apps/api/
  if (existsSync(apiRoot)) {
    for (const file of readdirSync(apiRoot)) {
      if (file.endsWith('.ts') && !['src', 'scripts', 'resources'].includes(file)) {
        // Already handled above for .ts files going to src/
      }
      if (file.endsWith('.config.ts')) {
        cpSync(join(apiRoot, file), join(destApi, file));
        console.log(`  Copied ${file}`);
      }
    }
  }

  // web/pages/* → apps/web/src/pages/
  const webPagesDir = join(absPath, 'web', 'pages');
  const destWebPages = join(PLUGIN_TEST_DIR, 'apps', 'web', 'src', 'pages');
  if (existsSync(webPagesDir)) {
    for (const entry of readdirSync(webPagesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const target = join(destWebPages, entry.name);
      cpSync(join(webPagesDir, entry.name), target, { recursive: true });
      console.log(`  Merged pages/${entry.name}`);
    }
  }
}

function dev(pluginPaths: string[]): void {
  const plugins: { absPath: string; plugin: PluginJson }[] = [];

  for (const p of pluginPaths) {
    const absPath = resolve(p);
    const pluginJsonPath = join(absPath, 'plugin.json');

    if (!existsSync(pluginJsonPath)) {
      throw new Error(`plugin.json not found at ${absPath}`);
    }

    plugins.push({ absPath, plugin: JSON.parse(readFileSync(pluginJsonPath, 'utf-8')) });
  }

  // Copy template into plugin-dev-server/
  console.log('Setting up plugin-dev-server directory...');
  copyTemplateToPluginTest();

  // Merge all plugins
  for (const { absPath, plugin } of plugins) {
    console.log(`Merging plugin "${plugin.name}"...`);
    mergePluginFiles(absPath);

    // Add plugin deps to plugin-dev-server's package.json (not template's)
    if (plugin.dependencies?.api) {
      const pkgJson = JSON.parse(readFileSync(join(PLUGIN_TEST_DIR, 'apps', 'api', 'package.json'), 'utf-8'));
      Object.assign(pkgJson.dependencies ??= {}, plugin.dependencies.api);
      writeFileSync(join(PLUGIN_TEST_DIR, 'apps', 'api', 'package.json'), JSON.stringify(pkgJson, null, 2) + '\n');
    }
    if (plugin.dependencies?.web) {
      const pkgJson = JSON.parse(readFileSync(join(PLUGIN_TEST_DIR, 'apps', 'web', 'package.json'), 'utf-8'));
      Object.assign(pkgJson.dependencies ??= {}, plugin.dependencies.web);
      writeFileSync(join(PLUGIN_TEST_DIR, 'apps', 'web', 'package.json'), JSON.stringify(pkgJson, null, 2) + '\n');
    }
  }

  // Install dependencies inside plugin-dev-server
  console.log('Installing dependencies...');
  execSync('pnpm install', { cwd: PLUGIN_TEST_DIR, stdio: 'inherit' });

  // Run codegen inside plugin-dev-server
  console.log('Running API codegen...');
  try { execSync('pnpm --filter api codegen', { cwd: PLUGIN_TEST_DIR, stdio: 'inherit' }); } catch {}

  // Push DB schema
  console.log('Pushing DB schema...');
  try { execSync('pnpm --filter api db:push', { cwd: PLUGIN_TEST_DIR, stdio: 'inherit' }); } catch {}

  // Watch all plugin sources for changes and re-merge
  const watchers: ReturnType<typeof watch>[] = [];

  for (const { absPath } of plugins) {
    const watchDirs = [join(absPath, 'api'), join(absPath, 'web')].filter(existsSync);

    for (const dir of watchDirs) {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      const watcher = watch(dir, { recursive: true }, (_, filename) => {
        if (!filename) return;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log(`\n  Plugin file changed: ${filename}, re-merging...`);
          mergePluginFiles(absPath);
        }, 200);
      });
      watchers.push(watcher);
    }
  }

  const cleanup = () => {
    console.log('\nCleaning up...');
    for (const w of watchers) w.close();
  };

  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });

  const names = plugins.map((p) => p.plugin.name).join(', ');
  console.log(`\nStarting dev server with plugins: ${names}`);
  console.log('Press Ctrl+C to stop.\n');

  try {
    execSync('pnpm turbo-start', { cwd: PLUGIN_TEST_DIR, stdio: 'inherit' });
  } finally {
    cleanup();
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'install': {
    if (!args[0]) {
      console.error('Usage: plugin install <git-url>');
      process.exit(1);
    }
    install(args[0]);
    break;
  }
  case 'uninstall': {
    if (!args[0]) {
      console.error('Usage: plugin uninstall <plugin-name>');
      process.exit(1);
    }
    uninstall(args[0]);
    break;
  }
  case 'list': {
    list();
    break;
  }
  case 'dev': {
    if (!args.length) {
      console.error('Usage: plugin dev <path...>');
      process.exit(1);
    }
    dev(args);
    break;
  }
  default: {
    console.log('Ship Plugin Manager\n');
    console.log('Commands:');
    console.log('  install <git-url>     Install a plugin from a git repository');
    console.log('  uninstall <name>      Uninstall a plugin by name');
    console.log('  list                  List installed plugins');
    console.log('  dev <path...>         Run plugins in dev mode');
    process.exit(command ? 1 : 0);
  }
}
