import GetResponseTypeFromSkipTimes from '../types/api/skip_time_types';

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
): NodeJS.Timeout | null {
  if (!skip.found) {
    return null;
  }
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
  const result: NodeJS.Timeout[] = [];
  const margin = 0.3;
  const opSkipper = skipIntervals(player, OP, margin);
  const edSkipper = skipIntervals(player, ED, margin);
  if (opSkipper != null) {
    result.push(opSkipper);
  }
  if (edSkipper != null) {
    result.push(edSkipper);
  }
  return result;
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
