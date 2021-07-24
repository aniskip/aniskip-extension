import { SkipTime } from '../../api';
import { SkipButtonOnClickHandler } from '../SkipButton';

export interface SkipButtonContainerProps {
  skipTimes: SkipTime[];
  currentTime: number;
  videoDuration: number;
  variant: string;
  onClickHandlers: SkipButtonOnClickHandler[];
}
