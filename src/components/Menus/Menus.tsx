import React from 'react';
import { MenusProps } from './Menus.types';
import { SubmitMenu } from '../SubmitMenu';
import { VoteMenu } from '../VoteMenu';
import { MenuContainer } from '../MenuContainer';

export const Menus = ({ variant }: MenusProps): JSX.Element => (
  <>
    <MenuContainer variant={variant}>
      <SubmitMenu />
    </MenuContainer>
    <MenuContainer variant={variant}>
      <VoteMenu />
    </MenuContainer>
  </>
);
