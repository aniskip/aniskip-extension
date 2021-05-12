let uBlockOriginLink = '';

switch (process.env.BROWSER) {
  case 'chromium':
    uBlockOriginLink =
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm';
    break;
  case 'firefox':
    uBlockOriginLink = 'addons.mozilla.org/en-US/firefox/addon/ublock-origin/';
    break;
  default:
    uBlockOriginLink =
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm';
    break;
}

module.exports = {
  sourceDir: './dist',
  run: {
    startUrl: [uBlockOriginLink, 'crunchyroll.com'],
    // If uses Edge/Opera etc Chromium based browsers
    //   chromiumBinary:
  },
};
