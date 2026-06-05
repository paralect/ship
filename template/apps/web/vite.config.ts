import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3002,
    strictPort: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          outputPath: 'index.html',
        },
      },
    }),
    viteReact(),
    svgr(),
  ],
});
