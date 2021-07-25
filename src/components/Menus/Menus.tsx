import React from 'react';
import { MenusProps } from './Menus.types';
import { SubmitMenu } from '../SubmitMenu';
import { VoteMenu } from '../VoteMenu';
import { MenuContainer } from '../MenuContainer';

export const Menus = ({
  variant,
  submitMenuProps,
  voteMenuProps,
}: MenusProps): JSX.Element => (
  <>
    <MenuContainer variant={variant}>
      <SubmitMenu
        variant={submitMenuProps.variant}
        hidden={submitMenuProps.hidden}
        onSubmit={submitMenuProps.onSubmit}
        onClose={submitMenuProps.onClose}
      />
    </MenuContainer>
    <MenuContainer variant={variant}>
      <VoteMenu
        variant={voteMenuProps.variant}
        hidden={voteMenuProps.hidden}
        skipTimes={voteMenuProps.skipTimes}
        onClose={voteMenuProps.onClose}
        submitMenuOpen={voteMenuProps.submitMenuOpen}
      />
    </MenuContainer>
  </>
);
