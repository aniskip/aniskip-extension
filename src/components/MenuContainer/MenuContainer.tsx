import React from 'react';
import { MenuContainerProps } from './MenuContainer.types';
import {
  getDomainName,
  useCheckIsFullscreen,
  useCheckIsMobile,
  useVariantRef,
} from '../../utils';

export function MenuContainer({ children }: MenuContainerProps): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();
  const { isMobile } = useCheckIsMobile();
  const variant = useVariantRef();
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute text-base z-10 left-5 bottom-16 md:left-auto md:right-5 md:bottom-32 pointer-events-none menus--${variant} menus--${domainName} ${
        isFullscreen
          ? `menus--fullscreen--${variant} menus--fullscreen--${domainName}`
          : ''
      } ${
        isMobile
          ? `menus--mobile menus--mobile--${variant} menus--mobile--${domainName}`
          : ''
      }`}
    >
      {children}
    </div>
  );
}
