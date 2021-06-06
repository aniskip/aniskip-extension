import { useState, useEffect } from 'react';

/**
 * Returns if the browser is in full screen
 */
const useFullscreenState = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fullscreenHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenHandler);

    return () =>
      document.removeEventListener('fullscreenchange', fullscreenHandler);
  }, [setIsFullscreen]);

  return { isFullscreen };
};

export default useFullscreenState;
