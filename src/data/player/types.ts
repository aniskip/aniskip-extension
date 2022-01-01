import { SkipTime } from '../../api';

export type PlayerState = {
  skipTimes: SkipTime[];
  isSubmitMenuVisible: boolean;
  isVoteMenuVisible: boolean;
};
