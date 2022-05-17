/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import path from 'path';
import generateManifest from './manifest';

const getRootPath = (...string: string[]): string =>
  path.resolve(__dirname, ...string);

export default defineConfig({
  root: 'src',
  mode: 'development',
  build: {
    outDir: getRootPath('dist'),
    emptyOutDir: true,
    sourcemap: 'inline',
  },
  plugins: [
    webExtension({
      manifest: generateManifest,
      assets: 'assets',
      additionalInputs: ['scripts/window-proxy/script.ts'],
    }),
  ],
});
