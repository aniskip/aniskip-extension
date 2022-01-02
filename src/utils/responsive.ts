import { useEffect, useState } from 'react';

/**
 * Returns true if a mobile browser is detected.
 */
export const isMobileCheck = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

/**
 * Returns if the browser is a mobile browser.
 */
export const useCheckIsMobile = (): { isMobile: boolean } => {
  const [isMobile] = useState(isMobileCheck());

  return { isMobile };
};

/**
 * Returns if the browser is in full screen.
 */
export const useCheckIsFullscreen = (): { isFullscreen: boolean } => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fullscreenHandler = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', fullscreenHandler);

    return (): void =>
      document.removeEventListener('fullscreenchange', fullscreenHandler);
  }, [setIsFullscreen]);

  return { isFullscreen };
};
