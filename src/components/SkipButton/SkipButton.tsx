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
      className={`skip-button pointer-events-none absolute right-5 bottom-16 z-10 md:right-11 skip-button--${variant} skip-button--${domainName} ${
        isFullscreen ? 'fullscreen' : ''
      } ${isMobile ? 'mobile' : ''}`}
    >
      <DefaultButton
        className={`whitespace-nowrap border border-gray-300 bg-neutral-800 bg-opacity-80 py-3 font-sans font-bold uppercase text-white backdrop-blur-md transition-opacity hover:bg-opacity-100 ${
          hidden ? 'pointer-events-none opacity-0' : 'pointer-events-auto'
        }`}
        {...props}
      >
        {`Skip ${SKIP_TYPE_NAMES[skipType]}`}
      </DefaultButton>
    </div>
  );
}
