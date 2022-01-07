const path = require('path');
const packageJson = require('./package.json');

const startUrl = ['github.com/Karmesinrot/Anifiltrs'];

switch (process.env.BROWSER) {
  case 'chromium':
    startUrl.push(
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm'
    );
    startUrl.push(
      'chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd'
    );
    break;
  case 'firefox':
    startUrl.unshift('addons.mozilla.org/en-US/firefox/addon/reduxdevtools/');
    startUrl.unshift('addons.mozilla.org/en-US/firefox/addon/ublock-origin/');
    break;
  default:
  // no default
}

module.exports = {
  sourceDir: path.join(__dirname, 'dist'),
  run: {
    startUrl,
    // If using Edge/Opera etc Chromium based browsers.
    //   chromiumBinary:
  },
  build: {
    artifactsDir: path.join(__dirname, 'web-ext-artifacts'),
    filename: `${packageJson.extensionName.toLocaleLowerCase()}-${
      process.env.BROWSER
    }-${packageJson.version}.zip`,
    overwriteDest: true,
  },
};
