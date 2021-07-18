/**
 * Checks if the current time is within an interval.
 *
 * @param startTime Start time of the interval.
 * @param endTime End time of the interval.
 * @param currentTime Current time to check.
 * @param offset Offset of the video provider.
 * @param margin Margin of error.
 */
const isInInterval = (
  startTime: number,
  endTime: number,
  currentTime: number,
  offset: number = 0,
  margin: number = 0
): boolean =>
  currentTime >= 0 &&
  startTime + margin + offset <= currentTime &&
  currentTime <= endTime - margin + offset;

export default isInInterval;
