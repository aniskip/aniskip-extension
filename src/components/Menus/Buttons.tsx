import React from 'react';

import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';
import { MenusButtonsProps } from '../../types/components/menus_types';

const Buttons = ({
  submitMenuButtonProps,
  voteMenuButtonProps,
}: MenusButtonsProps) => (
  <div className="flex items-center justify-center">
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
