import React from 'react';
import { SubmitMenuButton } from '../SubmitMenuButton';
import { VoteMenuButton } from '../VoteMenuButton';
import {
  getDomainName,
  useCheckIsFullscreen,
  useVariantRef,
} from '../../utils';

export function PlayerButtons(): JSX.Element {
  const { isFullscreen } = useCheckIsFullscreen();
  const variant = useVariantRef();
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`hidden sm:flex items-center justify-center player-buttons--${variant} player-buttons--${domainName} ${
        isFullscreen ? 'flex' : ''
      }`}
    >
      <SubmitMenuButton variant={variant} />
      <VoteMenuButton variant={variant} />
    </div>
  );
}
