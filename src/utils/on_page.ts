import { SkipTime } from '../types/api/skip_time_types';

/** Skips time on player based on skip intervals padded with margin
 * @param player Selector for media player with access to .currentTime and .duration
 * @param skipTime JSON object of SkipTimes type with information about skip times
 * @param margin Duration of padding to compensate for lack of skip time sensitivity
 * @returns Reference to skip interval if play
 */
export function skipInterval(
  player: HTMLVideoElement,
  skipTime: SkipTime,
  margin: number
): void {
  const currentTotalLength = player.duration;
  const skipDiff = currentTotalLength - skipTime.episode_length;
  const startTime = skipTime.interval.start_time;
  const endTime = skipTime.interval.end_time;
  if (startTime > margin) {
    if (
      player.currentTime >= startTime + skipDiff + margin &&
      player.currentTime <= endTime + skipDiff - margin
    ) {
      // eslint-disable-next-line no-param-reassign
      player.currentTime = endTime + skipDiff + margin;
    }
  } else if (
    player.currentTime >= 0 &&
    player.currentTime <= endTime + skipDiff - margin
  ) {
    // eslint-disable-next-line no-param-reassign
    player.currentTime = endTime + skipDiff - margin;
  }
}

// Helper function to capitalize the first letter
export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/**  Get provider name, provider anime id and anime episode number from current url
 * @returns A tuple of (providerName, animeId and episodeNumber)
 */
export function getProviderInformation(pathname: string, hostname: string) {
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
    case '9anime':
      regex = /.*\./;
      cleansedPath = pathname.replace(regex, '');
      regex = /\/ep-/;
      idEpsNumber = cleansedPath.split(regex);
      break;
    default:
      idEpsNumber = ['', ''];
      break;
  }
  const [identifier, episodeNumber] = idEpsNumber;
  const result = {
    providerName,
    identifier,
    episodeNumber: parseInt(episodeNumber, 10),
  };
  return result;
}
