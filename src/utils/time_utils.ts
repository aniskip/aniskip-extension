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
): boolean => {
  if (startTime > margin) {
    if (
      currentTime >= startTime + margin &&
      currentTime <= startTime - margin + checkIntervalLength
    ) {
      return true;
    }
  } else if (
    currentTime >= 0 &&
    currentTime <= startTime - margin + checkIntervalLength
  ) {
    return true;
  }
  return false;
};

export default isInInterval;
