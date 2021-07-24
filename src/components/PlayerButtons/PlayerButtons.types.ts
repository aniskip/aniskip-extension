import { SubmitMenuButtonOnClickHandler } from '../SubmitMenuButton';
import { VoteMenuButtonOnClickHandler } from '../VoteMenu';

export type PlayerButtonsState = {
  isSubmitButtonActive: boolean;
  isVoteButtonActive: boolean;
};

export type PlayerButtonsProps = {
  variant: string;
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
};
