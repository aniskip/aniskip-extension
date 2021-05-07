import React, { useEffect, useState } from 'react';
import { SkipTimeButtonProps } from '../types/components/skip_time_button_types';
import Button from './Button';

const SkipButton: React.FC<SkipTimeButtonProps> = ({
  skipType,
  variant,
  hidden,
  onClick,
}: SkipTimeButtonProps) => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const fullscreenHandler = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenHandler);

    return () =>
      document.removeEventListener('fullscreenchange', fullscreenHandler);
  }, [setFullscreen]);

  const skipTypeFullNames = {
    op: 'Opening',
    ed: 'Ending',
  };

  return (
    <Button
      className={`transition-opacity font-sans whitespace-nowrap text-white bg-trueGray-800 bg-opacity-80 py-3 absolute top-auto bottom-16 left-auto right-11 z-10 border border-gray-300 ${
        hidden && 'opacity-0 pointer-events-none'
      } skip-button--${variant} ${
        fullscreen && `skip-button--${variant}--fullscreen`
      }`}
      onClick={onClick}
    >
      {`Skip ${skipTypeFullNames[skipType]}`}
    </Button>
  );
};
export default SkipButton;
