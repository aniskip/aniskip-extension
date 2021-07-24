import { VoteMenuButtonOnClickHandler } from '../VoteMenu/VoteMenu.types';

export type VoteMenuButtonProps = {
  active?: boolean;
  variant: string;
  onClick: VoteMenuButtonOnClickHandler;
};
