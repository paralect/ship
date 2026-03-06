import got from 'got';

import config from 'config';

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

export interface PluginFile {
  /** Path relative to the plugin root (e.g. "apps/api/src/config/stripe.config.ts") */
  relativePath: string;
  content: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  dependencies?: Record<string, Record<string, string>>;
}

export interface DownloadedPlugin {
  files: PluginFile[];
  manifest: PluginManifest | null;
}

const fetchContents = async (owner: string, repo: string, dirPath: string): Promise<GitHubContent[]> => {
  return got(`https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`, {
    headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'create-ship-app' },
  }).json<GitHubContent[]>();
};

const downloadFileContent = async (url: string): Promise<string> => {
  return got(url, {
    headers: { 'User-Agent': 'create-ship-app' },
  }).text();
};

const downloadDirectory = async (
  owner: string,
  repo: string,
  githubPath: string,
  pluginRoot: string,
  result: DownloadedPlugin,
): Promise<void> => {
  const contents = await fetchContents(owner, repo, githubPath);

  for (const item of contents) {
    const relativePath = item.path.slice(pluginRoot.length + 1);

    if (item.type === 'dir') {
      await downloadDirectory(owner, repo, item.path, pluginRoot, result);
    } else if (item.type === 'file' && item.download_url) {
      const content = await downloadFileContent(item.download_url);

      if (relativePath === 'package.json') {
        result.manifest = JSON.parse(content) as PluginManifest;
      } else {
        result.files.push({ relativePath, content });
      }
    }
  }
};

export const downloadPlugin = async (pluginName: string): Promise<DownloadedPlugin> => {
  const owner = config.PLUGINS_REPO_OWNER;
  const repo = config.PLUGINS_REPO_NAME;

  const result: DownloadedPlugin = { files: [], manifest: null };

  await downloadDirectory(owner, repo, pluginName, pluginName, result);

  return result;
};
