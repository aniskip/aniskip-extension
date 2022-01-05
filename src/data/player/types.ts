import { PreviewSkipTime, SkipTime } from '../../api';

export type PlayerState = {
  previewSkipTime?: PreviewSkipTime;
  skipTimes: SkipTime[];
  isSubmitMenuVisible: boolean;
  isVoteMenuVisible: boolean;
};

export type PreviewSkipTimeUpdatedPayload = {
  intervalType: keyof SkipTime['interval'];
  time: number;
};
