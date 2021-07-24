import React from 'react';

import { PlayerButtonsProps } from './PlayerButtons.types';
import { SubmitMenuButton } from '../SubmitMenuButton';
import { VoteMenuButton } from '../VoteMenuButton';
import { getDomainName } from '../../utils';
import { useFullscreenState } from '../../hooks';

export const PlayerButtons = ({
  variant,
  submitMenuButtonProps,
  voteMenuButtonProps,
}: PlayerButtonsProps): JSX.Element => {
  const { isFullscreen } = useFullscreenState();

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`hidden sm:flex items-center justify-center menus-buttons--${variant} menus-buttons--${domainName} ${
        isFullscreen ? 'flex' : ''
      }`}
    >
      <SubmitMenuButton
        active={submitMenuButtonProps.active}
        variant={submitMenuButtonProps.variant}
        onClick={submitMenuButtonProps.onClick}
      />
      <VoteMenuButton
        active={voteMenuButtonProps.active}
        variant={voteMenuButtonProps.variant}
        onClick={voteMenuButtonProps.onClick}
      />
    </div>
  );
};
