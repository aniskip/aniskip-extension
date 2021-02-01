import {
  skipOpEd,
  getDataFromCurrentUrl,
  getMALId,
  getDataFromAPI,
} from './utils/on_page';

let intervals: NodeJS.Timeout[] = [];

// Main function to drive data extraction and skip implementation
async function main(): Promise<NodeJS.Timeout[] | null> {
  const webpageData = await getDataFromCurrentUrl();
  try {
    const malId = await getMALId(webpageData.providerName, webpageData.animeId);
    const { episodeNumber } = webpageData;
    const [openingSkip, endingSkip] = await Promise.all([
      getDataFromAPI(malId, episodeNumber, 'op'),
      getDataFromAPI(malId, episodeNumber, 'ed'),
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
