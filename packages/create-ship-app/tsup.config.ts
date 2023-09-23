import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  name: 'create-ship-app',
  entry: {
    index: 'src/index.ts',
  },
  minify: true,
  bundle: true,
  platform: 'node',
  tsconfig: './tsconfig.json',
  ...options,
}));
