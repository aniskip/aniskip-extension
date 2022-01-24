import React from 'react';
import { isMobile } from 'react-device-detect';
import { SkipButtonProps } from './SkipButton.types';
import { getDomainName, useCheckIsFullscreen } from '../../utils';
import { DefaultButton } from '../DefaultButton';
import { SKIP_TYPE_NAMES } from '../../api';

export function SkipButton({
  skipType,
  variant,
  hidden,
  ...props
}: SkipButtonProps): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute right-5 bottom-16 z-10 pointer-events-none md:right-11 skip-button skip-button--${variant} skip-button--${domainName} ${
        isFullscreen ? 'fullscreen' : ''
      } ${isMobile ? 'mobile' : ''}`}
    >
      <DefaultButton
        className={`transition-opacity font-sans whitespace-nowrap text-white bg-neutral-800 bg-opacity-80 py-3 border border-gray-300 font-bold uppercase hover:bg-opacity-100 backdrop-blur-md ${
          hidden ? 'opacity-0 pointer-events-none' : 'pointer-events-auto '
        }`}
        {...props}
      >
        {`Skip ${SKIP_TYPE_NAMES[skipType]}`}
      </DefaultButton>
    </div>
  );
}
