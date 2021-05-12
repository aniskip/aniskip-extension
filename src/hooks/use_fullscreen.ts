import { useState, useEffect } from 'react';

const useFullscreen = () => {
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

export default useFullscreen;
