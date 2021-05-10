import React from 'react';

import { MenusProps } from '../../types/components/menus_types';
import Buttons from './Buttons';
import SubmitMenu from './SubmitMenu';
import VoteMenu from './VoteMenu';

const Menus = ({ variant, submitMenuProps, voteMenuProps }: MenusProps) => (
  <>
    <SubmitMenu
      variant={variant}
      hidden={submitMenuProps.hidden}
      onSubmit={submitMenuProps.onSubmit}
      onClose={submitMenuProps.onClose}
    />
    <VoteMenu
      variant={variant}
      hidden={voteMenuProps.hidden}
      onClose={voteMenuProps.onClose}
    />
  </>
);

Menus.Buttons = Buttons;

export default Menus;
