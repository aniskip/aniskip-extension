import React, { useEffect, useState } from 'react';
import { SubmitMenuContainerProps } from '../types/components/submit_types';
import SubmitMenuButton from './SubmitMenuButton';
import SubmitMenu from './SubmitMenu';

const SubmitMenuContainer: React.FC<SubmitMenuContainerProps> = ({
  variant,
}: SubmitMenuContainerProps) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const fullscreenHandler = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenHandler);

    return () =>
      document.removeEventListener('fullscreenchange', fullscreenHandler);
  }, [setFullscreen]);

  return (
    <div
      className={`font-sans text-white flex items-center justify-center w-8 h-8 border-white border-b-2 border-opacity-0 ${
        clicked && 'border-opacity-100'
      } submit-container--${variant}`}
    >
      <SubmitMenuButton handleClick={() => setClicked((current) => !current)} />
      <SubmitMenu
        variant={variant}
        hidden={!clicked}
        fullScreen={fullscreen}
        onSubmit={() => setClicked(false)}
        onClose={() => setClicked(false)}
      />
    </div>
  );
};

export default SubmitMenuContainer;
