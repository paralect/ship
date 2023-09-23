import { createWriteStream, promises as fs } from 'fs';
import { promisify } from 'util';
import path, { join } from 'path';
import { Stream } from 'stream';
import { tmpdir } from 'os';
import got from 'got';
import tar from 'tar';

import config from 'config';
import { RepoInfo } from 'types';

const pipeline = promisify(Stream.pipeline);

export async function getRepoInfo(url: URL): Promise<RepoInfo | undefined> {
  const [, username, name] = url.pathname.split('/');

  const infoResponse = await got(`https://api.github.com/repos/${username}/${name}`).catch((e) => e);

  if (infoResponse.statusCode !== 200) {
    return undefined;
  }

  const info = JSON.parse(infoResponse.body);

  return { username, name, branch: info.default_branch };
}

async function downloadTar(url: string) {
  const tempFile = join(tmpdir(), `ship-app-${Date.now()}`);
  await pipeline(got.stream(url), createWriteStream(tempFile));

  return tempFile;
}

export async function downloadAndExtractRepo(
  root: string,
  { username, name, branch }: RepoInfo,
) {
  if (!config.USE_LOCAL_REPO) {
    console.log('Downloading repository from GitHub...');
    console.log();

    const tempFile = await downloadTar(`https://codeload.github.com/${username}/${name}/tar.gz/${branch}`);

    await tar.x({
      file: tempFile,
      cwd: root,
      filter: (p) => p.startsWith(
        `${name}-${branch.replace(/\//g, '-')}`,
      ),
    });

    // Rename folder with code from branch to name of repository
    await fs.rename(`${name}-${branch.replace(/\//g, '-')}`, name);

    await fs.unlink(tempFile);
  } else {
    console.log('[DEV] Copying local repository...');
    console.log();

    const localProjectRoot = path.join(__dirname, '../../..');
    const destPath = path.join(root, name);

    await fs.cp(localProjectRoot, destPath, {
      recursive: true,
      filter: (source) => !['node_modules', 'examples'].some((o) => source.includes(o)),
    });
  }
}
