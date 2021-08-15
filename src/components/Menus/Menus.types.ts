import { SkipTime } from '../../api';

export type MenusProps = {
  variant: string;
};

export type MenusState = {
  isSubmitMenuHidden: boolean;
  isVoteMenuHidden: boolean;
  skipTimes: SkipTime[];
};
