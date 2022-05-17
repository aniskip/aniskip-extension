/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import { Browser, generateManifest, getRootPath, Mode } from './vite';

const browser = (process.env.BROWSER as Browser | undefined) ?? 'chrome';
const mode = (process.env.NODE_ENV as Mode | undefined) ?? 'development';

export default defineConfig({
  root: getRootPath('src'),
  build: {
    outDir: getRootPath('dist'),
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : undefined,
  },
  plugins: [
    webExtension({
      manifest: () => generateManifest(mode),
      assets: 'assets',
      additionalInputs: ['scripts/window-proxy/script.ts'],
      browser,
    }),
  ],
});
