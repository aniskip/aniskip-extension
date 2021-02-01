import GetResponseTypeFromSkipTimes from '../types/pages/skip_time_types';

/** Generate time skips on player based on skip padded with margin
 * @param player Selector for media player with access to .currentTime and .duration
 * @param skip JSON object of SkipTimes type with information about skip times
 * @param margin Duration of padding to compensate for lack of skip time sensitivity
 * @returns Reference to skip interval if play
 */
export function skipIntervals(
  player: HTMLVideoElement,
  skip: GetResponseTypeFromSkipTimes,
  margin: number
): NodeJS.Timeout {
  const currentTotalLength = player.duration;
  const skipDiff = currentTotalLength - skip.result.episode_length;
  const startTime = skip.result.skip_times.start_time;
  const endTime = skip.result.skip_times.end_time;
  const skipper = setInterval(() => {
    if (startTime > margin) {
      if (
        player.currentTime >= startTime + skipDiff + margin &&
        player.currentTime <= endTime + skipDiff - margin
      ) {
        // eslint-disable-next-line no-param-reassign
        player.currentTime = endTime + skipDiff - margin;
        clearInterval(skipper);
      }
    } else if (
      player.currentTime >= 0 &&
      player.currentTime <= endTime + skipDiff - margin
    ) {
      // eslint-disable-next-line no-param-reassign
      player.currentTime = endTime + skipDiff - margin;
      clearInterval(skipper);
    }
  }, margin * 1000);
  return skipper;
}

/** Generates interval for time skips (WIP -> Needs options feeding)
 * @param OP JSON object of SkipTimes type with information about OP skip times
 * @param ED JSON object of SkipTimes type with information about ED skip times
 * @param player Selector for media player with access to .currentTime and .duration
 */
export function skipOpEd(
  OP: GetResponseTypeFromSkipTimes,
  ED: GetResponseTypeFromSkipTimes,
  player: HTMLVideoElement
): NodeJS.Timeout[] {
  const margin = 0.3;
  const opSkipper = skipIntervals(player, OP, margin);
  const edSkipper = skipIntervals(player, ED, margin);
  return [opSkipper, edSkipper];
}

// Helper function to capitalize the first letter
export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/**  Get provider name, provider anime id and anime episode number from current url
 * @returns A tuple of (providerName, animeId and episodeNumber)
 */
export async function getDataFromCurrentUrl() {
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
export async function getMALId(providerName: string, animeId: string) {
  const res = await fetch(
    `https://api.malsync.moe/page/${providerName}/${animeId}`
  );
  if (!res.ok) throw new Error('MAL ID not found');
  const json = await res.json();
  return json.malId;
}

/** Get data from backend api
 * @param malId Index for the particular anime on MAL
 * @param episodeNumber Episode number of the particular anime
 * @param skipType Either `op` for opening or `ed` for endinge
 */
export async function getDataFromAPI(
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
