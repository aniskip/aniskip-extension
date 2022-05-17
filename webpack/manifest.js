const { merge } = require('lodash');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const manifestTemplate = {
  manifest_version: 2,
  name: packageJson.extensionName,
  version: packageJson.version,
  description: packageJson.description,
  options_ui: {
    page: 'options.html',
    open_in_tab: true,
  },
  browser_action: {
    default_popup: 'popup.html',
  },
  background: {
    scripts: ['background-script.js'],
  },
  web_accessible_resources: ['window-proxy-script.js'],
  permissions: [
    'storage',
    '*://api.aniskip.com/*',
    '*://api.malsync.moe/*',
    '*://graphql.anilist.co/*',
    '*://beta-api.crunchyroll.com/*',
  ],
  icons: {
    16: 'icon_16.png',
    48: 'icon_48.png',
    128: 'icon_128.png',
  },
};

const browser = process.env.BROWSER;

const getPageUrls = () => {
  const pagesPath = path.join(__dirname, '..', 'src', 'pages');
  const pageNames = fs
    .readdirSync(pagesPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const pageUrls = pageNames
    .map(
      (pageName) =>
        JSON.parse(
          fs.readFileSync(path.join(pagesPath, pageName, 'metadata.json'))
        ).pageUrls
    )
    .flat();

  return pageUrls;
};

const getPlayerUrls = () => {
  const playersPath = path.join(__dirname, '..', 'src', 'players');
  const playerNames = fs
    .readdirSync(playersPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const playerUrls = playerNames
    .map(
      (playerName) =>
        JSON.parse(
          fs.readFileSync(path.join(playersPath, playerName, 'metadata.json'))
        ).playerUrls
    )
    .flat();

  return playerUrls;
};

module.exports = () => {
  const pageUrls = getPageUrls();
  const playerUrls = getPlayerUrls();
  manifestTemplate.content_scripts = [
    {
      matches: pageUrls,
      js: ['content-script.js'],
      run_at: 'document_start',
    },
    {
      matches: playerUrls,
      js: ['player-script.js'],
      all_frames: true,
      run_at: 'document_start',
    },
  ];

  if (process.env.NODE_ENV === 'development') {
    manifestTemplate.permissions.push('*://localhost/*');
  }

  switch (browser) {
    case 'chromium':
      return merge(manifestTemplate, {
        options_ui: {
          chrome_style: false,
        },
        browser_action: {
          chrome_style: false,
        },
      });
    case 'firefox':
      return merge(manifestTemplate, {
        options_ui: {
          browser_style: false,
        },
        browser_action: {
          browser_style: false,
        },
        browser_specific_settings: {
          gecko: {
            id: '{c67645fa-ad86-4b2f-ab7a-67fc5f3e9f5a}',
          },
        },
      });
    default:
      throw new Error(`Invalid browser type '${browser}'`);
  }
};
