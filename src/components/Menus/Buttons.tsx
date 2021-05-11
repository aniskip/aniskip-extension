import React from 'react';

import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';
import { MenusButtonsProps } from '../../types/components/menus_types';

const Buttons = ({
  variant,
  submitMenuButtonProps,
  voteMenuButtonProps,
}: MenusButtonsProps) => (
  <div
    className={`flex items-center justify-center submit-menu-buttons--${variant}`}
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

export default Buttons;
