import { SubmitMenuButtonOnClickHandler } from './submit_types';
import { VoteMenuButtonOnClickHandler } from './vote_menu_types';

export interface MenusProps {
  variant: string;
  submitMenuProps: {
    hidden: boolean;
    onSubmit: CallableFunction;
    onClose: CallableFunction;
  };
  voteMenuProps: {
    hidden: boolean;
    onClose: CallableFunction;
  };
}

export interface MenusButtonsProps {
  submitMenuButtonProps: {
    active: boolean;
    variant: string;
    onClick: SubmitMenuButtonOnClickHandler;
  };
  voteMenuButtonProps: {
    active: boolean;
    variant: string;
    onClick: VoteMenuButtonOnClickHandler;
  };
}

export interface MenusState {
  isSubmitMenuHidden: boolean;
  isVoteMenuHidden: boolean;
}

export interface MenusButtonsState {
  isSubmitButtonActive: boolean;
  isVoteButtonActive: boolean;
}
