import * as _ from 'lodash';
import path from 'path';
import fs from 'fs';

function loadAndMerge<T>(currentConfig: T, mergeConfigPath: string, currentDir: string): T {
  let mergedConfig: T = currentConfig;
  const localConfigPath = path.join(currentDir, mergeConfigPath);
  const fileExists = fs.existsSync(localConfigPath);

  if (!fileExists) {
    console.log(`Config file [${localConfigPath}] does not exists and was not merged.`);
    return mergedConfig;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configToMerge = require(localConfigPath);

  if (mergeConfigPath.endsWith('json')) {
    mergedConfig = _.merge(currentConfig, configToMerge);
  } else {
    mergedConfig = _.merge(currentConfig, configToMerge.default);
  }

  console.log(`Merged [${mergeConfigPath}] config on top of base config.`);
  return mergedConfig;
}

/**
 * 1. Merge current config with ${env}.json file
 * 2. When env=test, merge test-local.ts
 * 3. Otherwise merge local.ts if exists
 */
function loadConfig<T>(currentConfig: T, env: string, currentDir: string): T {
  let mergedConfig = loadAndMerge<T>(currentConfig, `./${env}.json`, currentDir);

  if (env === 'test') {
    mergedConfig = loadAndMerge<T>(mergedConfig, './test-local.ts', currentDir);
  } else {
    mergedConfig = loadAndMerge<T>(mergedConfig, './local.ts', currentDir);
  }

  return mergedConfig;
}

export default {
  loadConfig,
};
