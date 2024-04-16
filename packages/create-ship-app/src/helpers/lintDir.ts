import spawn from 'cross-spawn';

export const lintDir = async (cwd: string): Promise<void> => new Promise((resolve, reject) => {
  const args: string[] = ['turbo', 'run', 'test:eslint', '--force'];

  const child = spawn('npx', args, {
    stdio: 'inherit',
    cwd,
  });

  child.on('close', (code) => {
    if (code !== 0) {
      const error = { command: `npx ${args.join(' ')}` };

      reject(new Error(JSON.stringify(error)));

      return;
    }
    resolve();
  });
});
