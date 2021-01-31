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
) {
  if (player) {
    const currentTotalLength = player.duration;
    const epslength = skip.result.episode_length;
    const skipDiff = currentTotalLength - epslength;
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
  return null;
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
): [NodeJS.Timeout | null, NodeJS.Timeout | null] {
  if (player) {
    const margin = 0.3;
    const opSkipper = skipIntervals(player, OP, margin);
    const edSkipper = skipIntervals(player, ED, margin);
    return [opSkipper, edSkipper];
  }
  return [null, null];
}
