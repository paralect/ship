import fs from 'fs';

export const makeDir = (
  root: string,
  options = { recursive: true },
): Promise<string | undefined> => fs.promises.mkdir(root, options);
