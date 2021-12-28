import React from 'react';
import { MenuContainerProps } from './MenuContainer.types';
import {
  getDomainName,
  useCheckIsFullscreen,
  useCheckIsMobile,
} from '../../utils';

export function MenuContainer({
  variant,
  children,
}: MenuContainerProps): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();
  const { isMobile } = useCheckIsMobile();
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute text-base z-10 left-5 bottom-16 md:left-auto md:right-5 md:bottom-32 pointer-events-none menus--${variant} menus--${domainName} ${
        isFullscreen
          ? `menus--${variant}--fullscreen menus--${domainName}--fullscreen`
          : ''
      } ${
        isMobile
          ? `menus--mobile menus--${variant}--mobile menus--${domainName}--mobile`
          : ''
      }`}
    >
      {children}
    </div>
  );
}
