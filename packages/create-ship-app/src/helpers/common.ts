import { promises as fs } from 'fs';

import config from 'config';
import { TEMP_DIR_NAME } from 'app.constants';

export const onPromptState = (state: any) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h');
    process.stdout.write('\n');
    process.exit(1);
  }
};

export const handleSigTerm = () => process.exit(0);

export const isErrorLike = (err: unknown): err is { message: string } => (
  typeof err === 'object'
    && err !== null
    && typeof (err as { message?: unknown }).message === 'string'
);

export const replaceTextInFile = async (filePath: string, search: string, replace: string) => {
  try {
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Replace the text
    const newContent = fileContent.replace(new RegExp(search, 'g'), replace);

    // Write the new content back to the file
    await fs.writeFile(filePath, newContent, 'utf-8');
  } catch (error) {
    throw Error(`An error occurred: ${error}`);
  }
};

export const getDefaultProjectName = () => {
  let name = '';

  if (config.USE_TEMP_DIR) {
    name = `${TEMP_DIR_NAME}-${new Date().getTime()}`;
  }

  if (config.USE_TEMP_DIR && config.CLEANUP_TEMP_DIR) {
    name = TEMP_DIR_NAME;
  }

  return name;
};
