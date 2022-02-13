import { useEffect, useState } from 'react';

/**
 * Checks if the screen is in fullscreen mode.
 */
const checkIsFullscreen = (): boolean =>
  !!document.fullscreenElement ||
  // Hack to check fullscreen when next episode plays and the video does not
  // exit fullscreen mode.
  window.screen.height === window.innerHeight;

/**
 * Returns if the browser is in full screen.
 */
export const useCheckIsFullscreen = (): { isFullscreen: boolean } => {
  const [isFullscreen, setIsFullscreen] = useState(checkIsFullscreen());

  useEffect(() => {
    const fullscreenHandler = (): void => {
      setIsFullscreen(checkIsFullscreen());
    };

    document.addEventListener('fullscreenchange', fullscreenHandler);

    return (): void =>
      document.removeEventListener('fullscreenchange', fullscreenHandler);
  }, [setIsFullscreen]);

  return { isFullscreen };
};
