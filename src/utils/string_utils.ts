/**
 * Capitalizes the first letter of the input string
 * @param str String to capitalize the first letter of
 */
export const capitalizeFirstLetter = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

/**
 * Converts a time string into seconds
 * @param timeString Time in a string format of '(<hours>:)(<minutes>:)<seconds>'
 */
export const timeStringToSeconds = (timeString: string) => {
  // seconds, days, minutes
  const timeUnitToSeconds = [1, 60, 60 * 60];
  let seconds = 0;
  const times = timeString.split(':');
  times.reverse().forEach((time, index) => {
    const parsedTime = parseFloat(time);

    if (!parsedTime || index >= timeUnitToSeconds.length) {
      return;
    }

    seconds += parsedTime * timeUnitToSeconds[index];
  });

  return seconds;
};

/**
 * Converts seconds into a time string
 * @param seconds Number of seconds to convert to the format of '(<hours>:)<minutes>:<seconds>'
 */
export const secondsToTimeString = (
  seconds: number,
  decimalPlaces: number = 3
) => {
  let remainingSeconds = seconds;
  if (remainingSeconds < 0) {
    remainingSeconds = 0;
  }

  const hours = Math.floor(remainingSeconds / (60 * 60));
  const hoursFormatted = hours.toString();
  remainingSeconds %= 60 * 60;

  const minutes = Math.floor(remainingSeconds / 60);
  const minutesFormatted = minutes.toString().padStart(hours ? 2 : 1, '0');

  remainingSeconds %= 60;
  const secondsFormated = remainingSeconds
    .toFixed(decimalPlaces)
    .padStart(decimalPlaces + (decimalPlaces === 0 ? 2 : 3), '0');

  return `${
    hours ? `${hoursFormatted}:` : ''
  }${minutesFormatted}:${secondsFormated}`;
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

/**
 * Returns the domain name from the host name
 * @param hostname Host name to parse
 */
export const getDomainName = (hostname: string) =>
  hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
