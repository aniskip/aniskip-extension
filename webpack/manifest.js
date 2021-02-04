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
    scripts: ['background.js'],
  },
  permissions: ['*://api.malsync.moe/*'],
};

const getPageUrls = () => {
  const pagesPath = path.join(__dirname, '..', 'src', 'pages');
  const pageNames = fs.readdirSync(pagesPath);

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
      js: ['content.js'],
    },
    {
      matches: ['<all_urls>'],
      js: ['player.js'],
      all_frames: true,
      run_at: 'document_start',
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
      break;
    default:
      break;
  }

  if (env.NODE_ENV === 'development') {
    manifest.permissions.push('*://localhost/*');
  }
  return manifest;
};
