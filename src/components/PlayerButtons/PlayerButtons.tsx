import React from 'react';
import { PlayerButtonsProps } from './PlayerButtons.types';
import { SubmitMenuButton } from '../SubmitMenuButton';
import { VoteMenuButton } from '../VoteMenuButton';
import { getDomainName } from '../../utils';
import { useFullscreenState } from '../../hooks';

export const PlayerButtons = ({ variant }: PlayerButtonsProps): JSX.Element => {
  const { isFullscreen } = useFullscreenState();

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
};
