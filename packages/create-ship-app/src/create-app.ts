import retry from 'async-retry';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { existsSync, promises as fs } from 'fs';
import gradient from 'gradient-string';
import path from 'path';
import { cyan, green, yellow } from 'picocolors';

import {
  downloadAndExtractRepo,
  getRepoInfo,
  install,
  isErrorLike,
  isFolderEmpty,
  isWriteable,
  makeDir,
  replaceTextInFile,
  tryGitInit,
} from 'helpers';
import { deploymentInstaller } from 'installers';

import config from 'config';

import { Backend, Deployment, PackageManager, RepoInfo } from 'types';
import { HAPPY_CODING_TEXT, REPO_ISSUES_URL, REPO_URL, TEMPLATE_PATH } from 'app.constants';

export class DownloadError extends Error {}

export const createApp = async ({
  projectName,
  appPath,
  deployment,
  backend = 'postgres',
  plugins = [],
  packageManager = 'pnpm',
}: {
  projectName: string;
  appPath: string;
  packageManager?: PackageManager;
  deployment: Deployment;
  backend?: Backend;
  plugins?: string[];
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

  const apiPath = path.join(root, 'apps/api');

  if (backend === 'none') {
    // Web-only: drop the API app and its docker-compose entries.
    console.log(`${yellow('›')} Web-only mode — removing apps/api/.`);
    if (existsSync(apiPath)) {
      await fs.rm(apiPath, { recursive: true });
    }
    await stripApiFromTurboAndDocker(root);
  } else {
    await fs.cp(path.join(apiPath, '.env.example'), path.join(apiPath, '.env'));

    // Generate a random BETTER_AUTH_SECRET — better-auth's handler silently
    // refuses to issue tokens (returns 404 on /api/auth/*) when secret is
    // undefined, which surfaces as "auth doesn't work" with no log line.
    await ensureBetterAuthSecret(path.join(apiPath, '.env'));

    // Enforce the backend choice: keep only the selected DB's docker-compose
    // file + the matching `infra:<db>` script. Without this, the unselected
    // DB's compose can still be brought up accidentally.
    await applyBackendChoice(root, backend);

    // Merge the chosen DB plugin + any user-selected feature plugins into
    // <root>/plugins/.
    const clonedPluginsDir = path.join(root, repoInfo.name, 'plugins');
    const pluginsToInstall = [backend, ...plugins];
    if (existsSync(clonedPluginsDir) && pluginsToInstall.length > 0) {
      console.log(`${green('›')} Installing plugins: ${pluginsToInstall.join(', ')}`);
      await installSelectedPlugins(root, clonedPluginsDir, pluginsToInstall, backend);
    }
  }

  // Rename `ship-*` containers + `ship-network` → `<project>-*` across every
  // docker-compose file present at project root, INCLUDING plugin-added ones
  // (e.g. cloud-storage's garage compose). Without this, two scaffolded
  // projects on the same host collide on container/network names.
  for (const f of await fs.readdir(root)) {
    if (/^docker-compose.*\.ya?ml$/.test(f)) {
      await replaceTextInFile(path.join(root, f), 'ship', projectName);
    }
  }

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

  // Now that node_modules is populated, run API codegen so `src/router.ts` /
  // `src/db.ts` reflect every merged plugin resource.
  if (backend !== 'none' && existsSync(path.join(root, 'apps/api/package.json'))) {
    try {
      execSync('pnpm --filter api codegen', { cwd: root, stdio: 'inherit' });
    } catch {
      console.log(`${yellow('›')} codegen step failed — run \`pnpm --filter api codegen\` manually.`);
    }

    // For postgres scaffolds, wipe the template's baseline drizzle migration
    // and regenerate one that covers template + plugin tables in a single
    // file. Doing this from a clean slate makes drizzle-kit non-interactive
    // (no prior snapshot to diff against → no rename prompts).
    if (backend === 'postgres' && existsSync(path.join(root, 'apps/api/drizzle.config.ts'))) {
      const drizzleDir = path.join(root, 'apps/api/drizzle');
      if (existsSync(drizzleDir)) {
        for (const entry of await fs.readdir(drizzleDir)) {
          await fs.rm(path.join(drizzleDir, entry), { recursive: true, force: true });
        }
      }
      try {
        execSync('pnpm --filter api generate', { cwd: root, stdio: 'inherit' });
      } catch {
        console.log(`${yellow('›')} drizzle generate failed — run \`pnpm --filter api generate\` after install.`);
      }
    }
  }

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

/**
 * Append `BETTER_AUTH_SECRET=<random>` to the API .env if it's not already
 * defined. The zod config schema marks it optional, but better-auth's request
 * handler silently 404s on /api/auth/* when secret is undefined.
 */
async function ensureBetterAuthSecret(envPath: string): Promise<void> {
  if (!existsSync(envPath)) {
    return;
  }
  const raw = await fs.readFile(envPath, 'utf-8');
  if (/^BETTER_AUTH_SECRET=\S+/m.test(raw)) {
    return;
  }
  const secret = randomBytes(32).toString('base64');
  const sep = raw.endsWith('\n') ? '' : '\n';
  await fs.writeFile(envPath, `${raw}${sep}BETTER_AUTH_SECRET=${secret}\n`);
}

/**
 * Lock the scaffolded project to the chosen DB so the user can't accidentally
 * spin up the other engine via `pnpm infra:<other>`. Deletes the unselected
 * DB's docker-compose file and removes its `infra:<other>` script.
 */
async function applyBackendChoice(projectRoot: string, backend: Exclude<Backend, 'none'>): Promise<void> {
  const other = backend === 'postgres' ? 'mongo' : 'postgres';
  const otherCompose = path.join(projectRoot, `docker-compose.${other}.yml`);
  if (existsSync(otherCompose)) {
    await fs.rm(otherCompose);
  }

  const pkgJsonPath = path.join(projectRoot, 'package.json');
  if (existsSync(pkgJsonPath)) {
    const raw = await fs.readFile(pkgJsonPath, 'utf-8');
    const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
    if (pkg.scripts) {
      delete pkg.scripts[`infra:${other}`];
    }
    await fs.writeFile(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  // For mongo, flip `.env`: comment DATABASE_URL, uncomment MONGO_URI / MONGO_DB_NAME.
  // (`bin/run-all.sh` auto-detects the DB from compose files at runtime, so no script rewrite needed.)
  if (backend === 'mongo') {
    const envFile = path.join(projectRoot, 'apps/api/.env');
    if (existsSync(envFile)) {
      const raw = await fs.readFile(envFile, 'utf-8');
      const flipped = raw
        .replace(/^(DATABASE_URL=.*)$/m, '# $1')
        .replace(/^# (MONGO_URI=.*)$/m, '$1')
        .replace(/^# (MONGO_DB_NAME=.*)$/m, '$1');
      await fs.writeFile(envFile, flipped);
    }
  }
}

/**
 * Copies selected plugin directories from the cloned source repo into the
 * scaffolded project's own `plugins/` dir. Strips the unselected DB variant
 * (e.g. for `backend === 'postgres'`, the plugin's `mongo/` subdir is dropped)
 * so a single-DB scaffold doesn't ship the other engine's API code.
 */
async function installSelectedPlugins(
  projectRoot: string,
  srcPluginsDir: string,
  names: string[],
  backend: Exclude<Backend, 'none'>,
): Promise<void> {
  const destPluginsDir = path.join(projectRoot, 'plugins');
  const otherDb = backend === 'postgres' ? 'mongo' : 'postgres';

  for (const name of names) {
    const src = path.join(srcPluginsDir, name);
    if (!existsSync(src)) {
      continue;
    }
    const dest = path.join(destPluginsDir, name);
    try {
      execSync(`mkdir -p "${destPluginsDir}" && cp -R "${src}" "${dest}"`, { stdio: 'pipe' });
    } catch {
      continue;
    }

    // Strip the wrong DB variant if the plugin shipped both. Notes / ai-chat
    // use this layout: `plugins/<name>/{postgres,mongo}/api/...`.
    const otherVariant = path.join(dest, otherDb);
    if (existsSync(otherVariant)) {
      await fs.rm(otherVariant, { recursive: true });
    }

    // Wire the plugin into `apps/api`, `apps/web`, and `packages/` so its
    // resources/routes/packages/deps are actually live in the scaffold.
    // (Without this, plugin sources sit dormant in `<project>/plugins/`.)
    await mergePluginIntoApps(projectRoot, dest, backend);
  }
}

interface PluginJson {
  name: string;
  version?: string;
  dependencies?: {
    api?: Record<string, string>;
    web?: Record<string, string>;
  };
}

async function mergePluginIntoApps(
  projectRoot: string,
  pluginDir: string,
  backend: Exclude<Backend, 'none'>,
): Promise<void> {
  const pluginJsonPath = path.join(pluginDir, 'plugin.json');
  if (!existsSync(pluginJsonPath)) {
    return;
  }
  const plugin: PluginJson = JSON.parse(await fs.readFile(pluginJsonPath, 'utf-8'));
  const apiDest = path.join(projectRoot, 'apps/api');
  const webDest = path.join(projectRoot, 'apps/web');
  const pkgsDest = path.join(projectRoot, 'packages');

  // 1. Merge `<plugin>/api/**` and `<plugin>/<backend>/api/**` into apps/api.
  //    A plugin may have an `api/` at root (ai-chat, cloud-storage), a DB-variant
  //    `postgres/api/` (auth-starter, notes), or both.
  await mergeApiTree(path.join(pluginDir, 'api'), apiDest);
  await mergeApiTree(path.join(pluginDir, backend, 'api'), apiDest);

  // 2. Merge `<plugin>/web/**` into apps/web/src. The plugin's `web/routes/`
  //    becomes `apps/web/src/routes/` — TanStack Router auto-discovers them.
  //    Skip-if-exists so the template's curated files (e.g. routes the
  //    template ships) win over plugin copies.
  const pluginWeb = path.join(pluginDir, 'web');
  if (existsSync(pluginWeb)) {
    for (const entry of await fs.readdir(pluginWeb, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      await copyNewFilesOnly(
        path.join(pluginWeb, entry.name),
        path.join(webDest, 'src', entry.name),
      );
    }
  }

  // 3. Merge `<plugin>/packages/<pkg>/**` into <project>/packages/<pkg>.
  //    (ai-chat ships @ship/ai; cloud-storage ships @ship/cloud-storage, etc.)
  //    Template ships its own packages/{emails,db,cloud-storage,...} — leave
  //    those alone; only copy plugin packages that don't already exist.
  const pluginPkgs = path.join(pluginDir, 'packages');
  if (existsSync(pluginPkgs)) {
    for (const entry of await fs.readdir(pluginPkgs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dest = path.join(pkgsDest, entry.name);
      if (existsSync(dest)) continue;
      await fs.cp(path.join(pluginPkgs, entry.name), dest, { recursive: true });
    }
  }

  // 4. Append plugin deps to apps/{api,web}/package.json so `pnpm install` picks them up.
  if (plugin.dependencies?.api) {
    await addDepsToPkg(path.join(apiDest, 'package.json'), plugin.dependencies.api);
  }
  if (plugin.dependencies?.web) {
    await addDepsToPkg(path.join(webDest, 'package.json'), plugin.dependencies.web);
  }

  // 5. Plugin's docker-compose.yml → `<root>/docker-compose.<plugin>.yml`
  //    plus an `infra:<plugin>` script. Skip if the template already ships
  //    a curated compose for this plugin (postgres/mongo/cloud-storage):
  //    the template's version uses host port 5433 (not 5432) and is
  //    canonical, while the plugin's compose is for standalone dev only.
  const composeSrc = path.join(pluginDir, 'docker-compose.yml');
  if (existsSync(composeSrc)) {
    const composeDest = path.join(projectRoot, `docker-compose.${plugin.name}.yml`);
    if (!existsSync(composeDest)) {
      await fs.cp(composeSrc, composeDest);
      await addInfraScript(projectRoot, plugin.name);
    }
  }

  // 6. `<plugin>/.env.<plugin>` is appended to apps/api/.env
  const envSrc = path.join(pluginDir, `.env.${plugin.name}`);
  if (existsSync(envSrc)) {
    const envDest = path.join(apiDest, '.env');
    const existing = existsSync(envDest) ? await fs.readFile(envDest, 'utf-8') : '';
    const add = await fs.readFile(envSrc, 'utf-8');
    await fs.writeFile(envDest, `${existing.trimEnd()}\n\n${add}`);
  }

  // 7. Any .toml / .conf at plugin root (e.g. garage.toml) → project root.
  for (const f of await fs.readdir(pluginDir)) {
    if (f.endsWith('.toml') || f.endsWith('.conf')) {
      await fs.cp(path.join(pluginDir, f), path.join(projectRoot, f));
    }
  }
}

async function mergeApiTree(srcApiDir: string, destApiDir: string): Promise<void> {
  if (!existsSync(srcApiDir)) return;

  // All merges below use copy-new-files-only semantics: the template's curated
  // files (codegen scripts, `migrate.ts`, `auth.ts`, `db.ts`, baseline
  // resources, drizzle.config.ts) always win over plugin copies. Plugins only
  // contribute NEW files (new resources, new endpoints).

  // <plugin>/api/resources/<name> → apps/api/src/resources/<name>
  // (legacy plugin layout: no `src/` wrapper around resources)
  const resourcesDir = path.join(srcApiDir, 'resources');
  if (existsSync(resourcesDir)) {
    for (const entry of await fs.readdir(resourcesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      await copyNewFilesOnly(
        path.join(resourcesDir, entry.name),
        path.join(destApiDir, 'src/resources', entry.name),
      );
    }
  }

  // <plugin>/api/src/<entry> → apps/api/src/<entry>
  // Handles `src/resources/`, `src/admin-set.ts`, `src/server-config.ts`, etc.
  const srcDir = path.join(srcApiDir, 'src');
  if (existsSync(srcDir)) {
    for (const entry of await fs.readdir(srcDir, { withFileTypes: true })) {
      await copyNewFilesOnly(
        path.join(srcDir, entry.name),
        path.join(destApiDir, 'src', entry.name),
      );
    }
  }

  // <plugin>/api/*.ts at root (e.g. auth-starter's `api/auth.ts`,
  // `api/server-config.ts`) goes into apps/api/src/.
  for (const f of await fs.readdir(srcApiDir)) {
    if (!f.endsWith('.ts')) continue;
    if (f.endsWith('.config.ts')) continue; // handled below
    const stat = await fs.stat(path.join(srcApiDir, f));
    if (stat.isDirectory()) continue;
    const dest = path.join(destApiDir, 'src', f);
    if (existsSync(dest)) continue;
    await fs.cp(path.join(srcApiDir, f), dest);
  }

  // <plugin>/api/scripts/* → apps/api/scripts/
  const scriptsDir = path.join(srcApiDir, 'scripts');
  if (existsSync(scriptsDir)) {
    await copyNewFilesOnly(scriptsDir, path.join(destApiDir, 'scripts'));
  }

  // *.config.ts at plugin api root → apps/api/*.config.ts (e.g. drizzle.config.ts)
  for (const f of await fs.readdir(srcApiDir)) {
    if (f.endsWith('.config.ts')) {
      const dest = path.join(destApiDir, f);
      if (existsSync(dest)) continue;
      await fs.cp(path.join(srcApiDir, f), dest);
    }
  }
}

/**
 * Recursive copy that skips any file that already exists in the destination.
 * Used when merging plugin sources into a scaffolded template — the template's
 * curated copy wins for every file path that exists in both.
 */
async function copyNewFilesOnly(src: string, dest: string): Promise<void> {
  if (!existsSync(src)) return;
  const stat = await fs.stat(src);
  if (!stat.isDirectory()) {
    if (existsSync(dest)) return;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.cp(src, dest);
    return;
  }
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    await copyNewFilesOnly(path.join(src, entry.name), path.join(dest, entry.name));
  }
}

async function addDepsToPkg(pkgJsonPath: string, deps: Record<string, string>): Promise<void> {
  if (!existsSync(pkgJsonPath)) return;
  const raw = await fs.readFile(pkgJsonPath, 'utf-8');
  const pkg = JSON.parse(raw) as { dependencies?: Record<string, string> };
  pkg.dependencies ??= {};
  Object.assign(pkg.dependencies, deps);
  await fs.writeFile(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function addInfraScript(projectRoot: string, pluginName: string): Promise<void> {
  const pkgJsonPath = path.join(projectRoot, 'package.json');
  if (!existsSync(pkgJsonPath)) return;
  const raw = await fs.readFile(pkgJsonPath, 'utf-8');
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  pkg.scripts ??= {};
  pkg.scripts[`infra:${pluginName}`] = `docker compose -f docker-compose.${pluginName}.yml up`;
  await fs.writeFile(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

/**
 * In web-only mode, prune references to apps/api from the monorepo plumbing
 * so `pnpm install`, `pnpm turbo build`, and the docker-compose flows still
 * work without the API package. Also removes both DB compose files (no DB
 * needed) and the `infra:postgres` / `infra:mongo` scripts.
 */
async function stripApiFromTurboAndDocker(root: string): Promise<void> {
  const dockerCompose = path.join(root, 'docker-compose.yml');
  if (existsSync(dockerCompose)) {
    const raw = await fs.readFile(dockerCompose, 'utf-8');
    const stripped = raw.replace(/\n {2}api:[\s\S]*?(?=\n {2}\S|$)/g, '');
    await fs.writeFile(dockerCompose, stripped);
  }

  for (const name of ['docker-compose.postgres.yml', 'docker-compose.mongo.yml']) {
    const f = path.join(root, name);
    if (existsSync(f)) {
      await fs.rm(f);
    }
  }

  const pkgJsonPath = path.join(root, 'package.json');
  if (existsSync(pkgJsonPath)) {
    const raw = await fs.readFile(pkgJsonPath, 'utf-8');
    const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
    if (pkg.scripts) {
      delete pkg.scripts['infra:postgres'];
      delete pkg.scripts['infra:mongo'];
      delete pkg.scripts.dashboard;
      // Drop api#* tasks from turbo-start (no apps/api in web-only mode).
      pkg.scripts['turbo-start'] = 'turbo run dev';
    }
    await fs.writeFile(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}
