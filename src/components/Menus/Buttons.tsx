import React from 'react';

import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';
import { MenusButtonsProps } from '../../types/components/menus_types';
import { getDomainName } from '../../utils/string_utils';

const Buttons = ({
  variant,
  submitMenuButtonProps,
  voteMenuButtonProps,
}: MenusButtonsProps) => {
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`flex items-center justify-center menu-buttons--${variant} menu-buttons--${domainName}`}
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
