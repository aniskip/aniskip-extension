/**
 * Returns true if a mobile browser is detected.
 */
export const isMobileTest = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
