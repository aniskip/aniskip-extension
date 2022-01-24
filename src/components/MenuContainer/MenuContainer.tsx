import React from 'react';
import { isMobile } from 'react-device-detect';
import { MenuContainerProps } from './MenuContainer.types';
import {
  getDomainName,
  useCheckIsFullscreen,
  useVariantRef,
} from '../../utils';

export function MenuContainer({ children }: MenuContainerProps): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();
  const variant = useVariantRef();
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute text-base z-10 left-5 bottom-16 md:left-auto md:right-5 md:bottom-32 pointer-events-none menus menus--${variant} menus--${domainName} ${
        isFullscreen ? 'fullscreen' : ''
      } ${isMobile ? 'mobile' : ''}`}
    >
      {children}
    </div>
  );
}
