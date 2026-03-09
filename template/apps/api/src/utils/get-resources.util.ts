import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESOURCES_PATH = path.join(__dirname, '../resources');
const IGNORE_LIST = ['token'];

export const getResources = (): string[] => {
  const resourceDirs = fs
    .readdirSync(RESOURCES_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !IGNORE_LIST.includes(dirent.name))
    .map((dirent) => dirent.name);

  return resourceDirs;
};

export const getResourcePath = (resourceName: string): string => {
  return path.join(RESOURCES_PATH, resourceName);
};
