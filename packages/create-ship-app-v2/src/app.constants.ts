import { Deployment } from './types';

export const HAPPY_CODING_TEXT = `  _   _                                         _ _             _
 | | | | __ _ _ __  _ __  _   _    ___ ___   __| (_)_ __   __ _| |
 | |_| |/ _\` | '_ \\| '_ \\| | | |  / __/ _ \\ / _\` | | '_ \\ / _\` | |
 |  _  | (_| | |_) | |_) | |_| | | (_| (_) | (_| | | | | | (_| |_|
 |_| |_|\\__,_| .__/| .__/ \\__, |  \\___\\___/ \\__,_|_|_| |_|\\__, (_)
             |_|   |_|    |___/                           |___/
`;

export const TEMPLATE_PATH = '/template';
export const TEMP_DIR_NAME = 'my-ship-app';

export const REPO_URL = new URL('https://github.com/paralect/ship');
export const REPO_ISSUES_URL = `${REPO_URL.href}/issues`;

export const DEPLOYMENT_SHORTCUTS = {
  'do-apps': Deployment.DIGITAL_OCEAN_APPS,
  render: Deployment.RENDER,
  'do-kubernetes': Deployment.DIGITAL_OCEAN_KUBERNETES,
  'aws-eks': Deployment.AWS_KUBERNETES,
};
