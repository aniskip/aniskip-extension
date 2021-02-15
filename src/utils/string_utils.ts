/**
 * Capitalizes the first letter of the input string
 * @param str String to capitalize the first letter of
 */
export const capitalizeFirstLetter = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

/**
 * Converts a time string into seconds
 * @param timeString Time in a string format of '<minutes>:<seconds>'
 */
export const timeStringToSeconds = (timeString: string) => {
  const [minutesString, secondsString] = timeString.split(':');
  const minutes = parseInt(minutesString, 10) || 0;
  const seconds = parseFloat(secondsString) || 0;
  return minutes * 60 + seconds;
};

/**
 * Converts seconds into a time string
 * @param seconds Number of seconds to convert to the format of '<minutes>:<seconds>'
 */
export const secondsToTimeString = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(1, '0');
  const remainder = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${minutes}:${remainder}`;
};

/**
 * Formats a time string to be in the format of '<minutes>:<seconds>'
 * @param timeString Unformatted time string
 */
export const formatTimeString = (timeString: string) => {
  const timeStringNumber = Number(timeString);
  const isNumber = Number.isFinite(timeStringNumber);
  const seconds = isNumber ? timeStringNumber : timeStringToSeconds(timeString);
  return secondsToTimeString(seconds);
};
