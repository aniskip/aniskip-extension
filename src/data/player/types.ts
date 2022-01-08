import { PreviewSkipTime, SkipTime } from '../../api';

export type PlayerState = {
  previewSkipTime?: PreviewSkipTime;
  skipTimes: SkipTime[];
  isSubmitMenuVisible: boolean;
  isVoteMenuVisible: boolean;
  playerControlsListenerType: KeyboardEventListenerType;
};

export type PreviewSkipTimeUpdatedPayload = {
  intervalType: keyof SkipTime['interval'];
  time: number;
};

export type KeyboardEventListenerType = 'keydown' | 'keyup' | 'keypress';
