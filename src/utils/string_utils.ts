// Helper function to capitalize the first letter
export const capitalizeFirstLetter = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

export const timeStringToSeconds = (timeString: string) => {
  const [minutes, seconds] = timeString.split(':');
  return parseInt(minutes, 10) * 60 + parseFloat(seconds);
};

export const secondsToTimeString = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${remainder}`;
};
