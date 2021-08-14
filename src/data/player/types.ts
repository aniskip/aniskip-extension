import { SkipTime } from '../../api';

export type PlayerState = {
  isReady: boolean;
  skipTimes: SkipTime[];
  isSubmitMenuVisible: boolean;
  isVoteMenuVisible: boolean;
};
