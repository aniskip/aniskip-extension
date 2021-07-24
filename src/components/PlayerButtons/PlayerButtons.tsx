import React from 'react';
import { useFullscreenState } from '../../hooks';
import { getDomainName } from '../../utils';
import { MenusButtonsProps } from '../Menus';
import { SubmitMenuButton } from '../SubmitMenuButton';
import { VoteMenuButton } from '../VoteMenuButton';

export const PlayerButtons = ({
  variant,
  submitMenuButtonProps,
  voteMenuButtonProps,
}: MenusButtonsProps): JSX.Element => {
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
