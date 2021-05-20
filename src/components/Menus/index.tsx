import React from 'react';

import { MenusProps } from '../../types/components/menus_types';
import Buttons from './Buttons';
import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';

const Menus = ({ submitMenuProps, voteMenuProps }: MenusProps) => (
  <div className="text-sm md:text-base">
    <SubmitMenu
      variant={submitMenuProps.variant}
      hidden={submitMenuProps.hidden}
      onSubmit={submitMenuProps.onSubmit}
      onClose={submitMenuProps.onClose}
    />
    <VoteMenu
      variant={voteMenuProps.variant}
      hidden={voteMenuProps.hidden}
      skipTimes={voteMenuProps.skipTimes}
      onClose={voteMenuProps.onClose}
    />
  </div>
);

Menus.Buttons = Buttons;

export default Menus;
