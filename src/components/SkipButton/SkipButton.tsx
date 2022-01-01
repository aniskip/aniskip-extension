import React from 'react';
import { SkipButtonProps } from './SkipButton.types';
import {
  getDomainName,
  useCheckIsFullscreen,
  useCheckIsMobile,
} from '../../utils';
import { DefaultButton } from '../DefaultButton';
import { SKIP_TYPE_NAMES } from '../../api';

export function SkipButton({
  skipType,
  variant,
  hidden,
  ...props
}: SkipButtonProps): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();
  const { isMobile } = useCheckIsMobile();

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute right-11 bottom-16 z-10 pointer-events-none skip-button--${variant} skip-button--${domainName} ${
        isFullscreen
          ? `skip-button--${variant}--fullscreen skip-button--${domainName}--fullscreen`
          : ''
      } ${
        isMobile
          ? `skip-button--mobile skip-button--${variant}--mobile skip-button--${domainName}--mobile`
          : ''
      }`}
    >
      <DefaultButton
        className={`transition-opacity font-sans whitespace-nowrap text-white bg-neutral-800 bg-opacity-80 py-3 border border-gray-300 font-bold uppercase hover:bg-opacity-100 ${
          hidden ? 'opacity-0 pointer-events-none' : 'pointer-events-auto '
        }`}
        {...props}
      >
        {`Skip ${SKIP_TYPE_NAMES[skipType]}`}
      </DefaultButton>
    </div>
  );
}
