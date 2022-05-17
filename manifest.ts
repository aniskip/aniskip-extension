import fs from 'fs';
import path from 'path';
import { Manifest } from 'webextension-polyfill-ts';
import packageJson from './package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 2,
  name: packageJson.extensionName,
  version: packageJson.version,
  description: packageJson.description,
  options_ui: {
    page: 'options/options.html',
  },
  browser_action: {
    default_popup: 'options/popup.html',
  },
  background: {
    scripts: ['scripts/background/script.ts'],
  },
  web_accessible_resources: ['scripts/window-proxy/script.js'],
  permissions: [
    'storage',
    '*://api.aniskip.com/*',
    '*://api.malsync.moe/*',
    '*://graphql.anilist.co/*',
    '*://beta-api.crunchyroll.com/*',
  ],
  icons: {
    16: 'assets/icon_16.png',
    48: 'assets/icon_48.png',
    128: 'assets/icon_128.png',
  },
};

const getPageUrls = (): string[] => {
  const pagesPath = path.join(__dirname, 'src', 'pages');
  const pageNames = fs
    .readdirSync(pagesPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const pageUrls = pageNames
    .map(
      (pageName) =>
        JSON.parse(
          fs
            .readFileSync(path.join(pagesPath, pageName, 'metadata.json'))
            .toString()
        ).pageUrls
    )
    .flat();

  return pageUrls;
};

const getPlayerUrls = (): string[] => {
  const playersPath = path.join(__dirname, 'src', 'players');
  const playerNames = fs
    .readdirSync(playersPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const playerUrls = playerNames
    .map(
      (playerName) =>
        JSON.parse(
          fs
            .readFileSync(path.join(playersPath, playerName, 'metadata.json'))
            .toString()
        ).playerUrls
    )
    .flat();

  return playerUrls;
};

export default (): Manifest.WebExtensionManifest => {
  const pageUrls = getPageUrls();
  const playerUrls = getPlayerUrls();

  manifest.content_scripts = [
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
  ];

  switch (process.env.BROWSER) {
    case 'chromium':
      manifest.options_ui!.chrome_style = false;
      manifest.options_ui!.open_in_tab = true;
      // @ts-ignore: Exists on chrome extensions.
      manifest.browser_action!.chrome_style = false;
      break;
    case 'firefox':
      manifest.options_ui!.browser_style = false;
      manifest.options_ui!.open_in_tab = true;
      manifest.browser_action!.browser_style = false;
      manifest.browser_specific_settings = {
        gecko: {
          id: '{c67645fa-ad86-4b2f-ab7a-67fc5f3e9f5a}',
        },
      };
      break;
    default:
    // no default
  }

  if (process.env.NODE_ENV === 'development') {
    manifest.permissions!.push('*://localhost/*');
  }
  return manifest;
};
