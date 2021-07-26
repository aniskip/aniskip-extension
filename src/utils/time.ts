/**
 * Checks if the current time is within an interval.
 *
 * @param startTime Start time of the interval.
 * @param endTime End time of the interval.
 * @param currentTime Current time to check.
 * @param offset Offset of the video provider.
 * @param margin Margin of error.
 */
export const isInInterval = (
  startTime: number,
  endTime: number,
  currentTime: number,
  offset: number = 0,
  margin: number = 0
): boolean =>
  currentTime >= 0 &&
  startTime + margin + offset <= currentTime &&
  currentTime <= endTime - margin + offset;

/**
 * Returns the date object seven days from now.
 */
export const getNextWeekDate = (): Date => {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );

  return nextWeek;
};
