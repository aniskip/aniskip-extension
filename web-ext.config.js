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
}

module.exports = {
  sourceDir: './dist',
  run: {
    startUrl: [uBlockOriginLink, 'crunchyroll.com'],
  },
};
