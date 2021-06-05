import React from 'react';

import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';
import { MenusButtonsProps } from '../../types/components/menus_types';
import { getDomainName } from '../../utils/string_utils';
import useFullscreenState from '../../hooks/use_fullscreen_state';

const Buttons = ({
  variant,
  submitMenuButtonProps,
  voteMenuButtonProps,
}: MenusButtonsProps) => {
  const { isFullscreen } = useFullscreenState();

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`hidden sm:flex items-center justify-center menus-buttons--${variant} menus-buttons--${domainName} ${
        isFullscreen ? 'flex' : ''
      }`}
    >
      <SubmitMenu.Button
        active={submitMenuButtonProps.active}
        variant={submitMenuButtonProps.variant}
        onClick={submitMenuButtonProps.onClick}
      />
      <VoteMenu.Button
        active={voteMenuButtonProps.active}
        variant={voteMenuButtonProps.variant}
        onClick={voteMenuButtonProps.onClick}
      />
    </div>
  );
};

export default Buttons;
