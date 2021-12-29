import React from 'react';
import { SubmitMenu } from '../SubmitMenu';
import { VoteMenu } from '../VoteMenu';
import { MenuContainer } from '../MenuContainer';

export function Menus(): JSX.Element {
  return (
    <>
      <MenuContainer>
        <SubmitMenu />
      </MenuContainer>
      <MenuContainer>
        <VoteMenu />
      </MenuContainer>
    </>
  );
}
