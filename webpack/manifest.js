const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const manifest = {
  manifest_version: 2,
  name: packageJson.extensionName,
  version: packageJson.version,
  description: packageJson.description,
  options_ui: {
    page: 'options.html',
  },
  browser_action: {
    default_popup: 'popup.html',
  },
  background: {
    scripts: ['background_script.js'],
  },
  permissions: ['storage', '*://api.malsync.moe/*'],
};

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
        ).urls
    )
    .flat();

  return pageUrls;
};

module.exports = (env) => {
  const urls = getPageUrls();
  manifest.content_scripts = [
    {
      matches: urls,
      js: ['content_script.js'],
    },
    {
      matches: ['<all_urls>'],
      js: ['player_script.js'],
      all_frames: true,
    },
  ];
  manifest.optional_permissions = urls;

  switch (env.BROWSER) {
    case 'chromium':
      manifest.options_ui.chrome_style = true;
      manifest.browser_action.chrome_style = true;
      break;
    case 'firefox':
      manifest.options_ui.browser_style = true;
      manifest.browser_action.browser_style = true;
      manifest.browser_specific_settings = {
        gecko: {
          id: '{c67645fa-ad86-4b2f-ab7a-67fc5f3e9f5a}',
        },
      };
      break;
    default:
      break;
  }

  if (env.NODE_ENV === 'development') {
    manifest.permissions.push('*://localhost/*');
  }
  return manifest;
};
