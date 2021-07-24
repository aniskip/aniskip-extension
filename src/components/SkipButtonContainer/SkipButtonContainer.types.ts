import { SkipTime } from '../../api';
import { SkipButtonOnClickHandler } from '../SkipButton';

export type SkipButtonContainerProps = {
  skipTimes: SkipTime[];
  currentTime: number;
  videoDuration: number;
  variant: string;
  onClickHandlers: SkipButtonOnClickHandler[];
};
