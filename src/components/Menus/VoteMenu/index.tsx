import React from 'react';

import { VoteMenuProps } from '../../../types/components/vote_menu_types';
import Button from './Button';

const VoteMenu = ({ variant, hidden, onClose }: VoteMenuProps) => (
  <div>hello world</div>
);

VoteMenu.Button = Button;

export default VoteMenu;
