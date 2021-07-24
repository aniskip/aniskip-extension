import { SkipTime } from '../../api';
import { SubmitMenuProps } from '../SubmitMenu/SubmitMenu.types';
import { VoteMenuProps } from '../VoteMenu/VoteMenu.types';

export type MenusProps = {
  variant: string;
  submitMenuProps: SubmitMenuProps;
  voteMenuProps: VoteMenuProps;
};

export type MenusState = {
  isSubmitMenuHidden: boolean;
  isVoteMenuHidden: boolean;
  skipTimes: SkipTime[];
};
