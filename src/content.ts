import MalsyncHttpClient from './api/malsync_http_client';
import OpeningSkipperHttpClient from './api/opening_skipper_http_client';
import { skipOpEd, getDataFromCurrentUrl } from './utils/on_page';

const openingSkipperHttpClient = new OpeningSkipperHttpClient();
const malsyncHttpClient = new MalsyncHttpClient();
let intervals: NodeJS.Timeout[] = [];

// Main function to drive data extraction and skip implementation
async function main(): Promise<NodeJS.Timeout[] | null> {
  const webpageData = await getDataFromCurrentUrl();
  try {
    const malId = await malsyncHttpClient.getMalId(
      webpageData.providerName,
      webpageData.animeId
    );
    const episodeNumber = parseInt(webpageData.episodeNumber, 10);
    const [openingSkip, endingSkip] = await Promise.all([
      openingSkipperHttpClient.getSkipTimes(malId, episodeNumber, 'op'),
      openingSkipperHttpClient.getSkipTimes(malId, episodeNumber, 'ed'),
    ]);
    const player: HTMLVideoElement | null = document.querySelector('#player');
    if (player) {
      player.addEventListener(
        'loadedmetadata',
        () => {
          intervals.forEach((interval) => {
            clearInterval(interval);
          });
          intervals = skipOpEd(openingSkip, endingSkip, player);
        },
        { once: true }
      );
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

// Handles URL change in SPAs
let lastUrl = window.location.href;
new MutationObserver(async () => {
  const url = window.location.href;

  if (url !== lastUrl) {
    lastUrl = url;
    main();
  }
}).observe(document, { subtree: true, childList: true });

main();
