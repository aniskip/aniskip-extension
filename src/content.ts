import GetResponseTypeFromSkipTimes from './types/pages/skip_time_types';
import { skipOpEd } from './utils/on_page';

// Helper function to capitalize the first letter
function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/**  Get provider name, provider anime id and anime episode number from current url
 * @returns A tuple of (providerName, animeId and episodeNumber)
 */
async function getDataFromCurrentUrl() {
  const { pathname, hostname } = window.location;
  let regex = /(?:[^.\n]*\.)?([^.\n]*)(\..*)/;
  const providerName = capitalizeFirstLetter(hostname.replace(regex, '$1'));

  let idEpsNumber: string[] = [];
  let cleansedPath;

  switch (providerName) {
    case 'Aniwatch':
      regex = /\/anime\//;
      cleansedPath = pathname.replace(regex, '');
      regex = /\//;
      idEpsNumber = cleansedPath.split(regex);
      break;
    case 'Gogoanime':
      regex = /\//;
      cleansedPath = pathname.replace(regex, '');
      regex = /-episode-/;
      idEpsNumber = cleansedPath.split(regex);
      break;
    case '9Anime':
      regex = /.*\./;
      cleansedPath = pathname.replace(regex, '');
      regex = /\./;
      idEpsNumber = cleansedPath.split(regex);
      break;
    default:
      idEpsNumber = ['', ''];
      break;
  }
  const [animeId, episodeNumber] = idEpsNumber;
  const result = {
    providerName,
    animeId,
    episodeNumber,
  };
  return result;
}

/** Get MAL id from API with provided providerName and animeId
 * @param providerName Provider name, first letter must be capitalized if possible
 * @param animeId Anime id for the specified provider, no uniform format
 * @returns malId
 */
async function getMALId(providerName: string, animeId: string) {
  const res = await fetch(
    `https://api.malsync.moe/page/${providerName}/${animeId}`
  );
  if (!res.ok) throw new Error('MAL ID not found');
  const json = await res.json();
  return json.malId;
}

async function getDataFromAPI(
  malId: string,
  episodeNumber: string,
  skipType: 'op' | 'ed'
): Promise<GetResponseTypeFromSkipTimes> {
  const res = await fetch(
    `http://localhost:5000/api/v1/skip-times/${malId}/${episodeNumber}?type=${skipType}`
  );
  const json = await res.json();
  return json;
}

async function main() {
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
      let openingSkipper;
      let endingSkipper;
      player.addEventListener('loadedmetadata', () => {
        [openingSkipper, endingSkipper] = skipOpEd(
          openingSkip,
          endingSkip,
          player
        );
      });
      console.log({ openingSkipper, endingSkipper });
    }
  } catch (err) {
    console.error(err);
  }
}

main();

exports = {
  getMALId,
  capitalizeFirstLetter,
  getDataFromCurrentUrl,
};
