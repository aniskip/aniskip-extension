import React from 'react';
import useFullscreen from '../../hooks/use_fullscreen';
import { SkipButtonProps } from '../../types/components/skip_time_button_types';
import { getDomainName } from '../../utils/string_utils';
import DefaultButton from '../Button';

const Button = ({ skipType, variant, hidden, onClick }: SkipButtonProps) => {
  const { isFullscreen } = useFullscreen();

  const skipTypeFullNames = {
    op: 'Opening',
    ed: 'Ending',
  };

  const domainName = getDomainName(window.location.hostname);

  return (
    <div className="absolute right-11 bottom-16">
      <DefaultButton
        className={`transition-opacity font-sans whitespace-nowrap text-white bg-trueGray-800 bg-opacity-80 py-3 border border-gray-300 font-bold uppercase ${
          hidden ? 'opacity-0 pointer-events-none' : ''
        } skip-button--${variant} ${
          isFullscreen ? `skip-button--${variant}--fullscreen` : ''
        } skip-button--${domainName} `}
        onClick={onClick}
      >
        {`Skip ${skipTypeFullNames[skipType]}`}
      </DefaultButton>
    </div>
  );
};
export default Button;
