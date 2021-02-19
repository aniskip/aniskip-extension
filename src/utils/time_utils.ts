/**
 * Checks if the current time is within an interval
 * @param startTime Start time of the interval
 * @param currentTime Current time to check
 * @param margin Margin of error
 * @param checkIntervalLength Interval length
 */
const isInInterval = (
  startTime: number,
  currentTime: number,
  margin: number,
  checkIntervalLength: number
): boolean =>
  currentTime >= 0 && currentTime <= startTime - margin + checkIntervalLength;

export default isInInterval;
