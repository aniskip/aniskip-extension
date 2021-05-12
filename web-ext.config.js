const startUrl = ['crunchyroll.com'];

switch (process.env.BROWSER) {
  case 'chromium':
    startUrl.push(
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm'
    );
    break;
  case 'firefox':
    startUrl.unshift('addons.mozilla.org/en-US/firefox/addon/ublock-origin/');
    break;
  default:
}

module.exports = {
  sourceDir: './dist',
  run: {
    startUrl,
  },
};
