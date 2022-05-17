/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { Manifest } from 'webextension-polyfill-ts';
import { readJsonFile } from 'vite-plugin-web-extension';
import { merge } from 'lodash';
import { Mode } from './types';
import { getRootPath } from './utils';
import packageJson from '../package.json';

const getPageUrls = (): string[] => {
  const pagesPath = getRootPath('src', 'pages');
  const pageNames = fs
    .readdirSync(pagesPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const pageUrls = pageNames
    .map(
      (pageName) =>
        readJsonFile(path.join(pagesPath, pageName, 'metadata.json')).pageUrls
    )
    .flat();

  return pageUrls;
};

const getPlayerUrls = (): string[] => {
  const playersPath = getRootPath('src', 'players');
  const playerNames = fs
    .readdirSync(playersPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const playerUrls = playerNames
    .map(
      (playerName) =>
        readJsonFile(path.join(playersPath, playerName, 'metadata.json'))
          .playerUrls
    )
    .flat();

  return playerUrls;
};

export const generateManifest = (mode: Mode): Manifest.WebExtensionManifest => {
  const manifestTemplate = readJsonFile(
    getRootPath('vite', 'manifest.template.json')
  );

  const pageUrls = getPageUrls();
  const playerUrls = getPlayerUrls();

  return merge(manifestTemplate, {
    name: packageJson.extensionName,
    description: packageJson.description,
    version: packageJson.version,
    content_scripts: [
      {
        matches: pageUrls,
        js: ['scripts/content/script.ts'],
        run_at: 'document_start',
      },
      {
        matches: playerUrls,
        js: ['scripts/player/script.ts'],
        all_frames: true,
        run_at: 'document_start',
      },
    ],
    // permissions: mode === 'development' ? ['*://localhost/*'] : undefined,
  });
};
