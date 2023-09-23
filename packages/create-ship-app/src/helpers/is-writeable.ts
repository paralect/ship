import fs from 'fs';

export const isWriteable = async (directory: string): Promise<boolean> => {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK);

    return true;
  } catch (err) {
    return false;
  }
};
