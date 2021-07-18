import { SkipTime } from '../../api';

export interface SkipTimeIndicatorProps {
  startTime: number;
  endTime: number;
  episodeLength: number;
  className?: string;
  variant: string;
}

export interface SkipTimeIndicatorContainerProps {
  skipTimes: SkipTime[];
  videoDuration: number;
  variant: string;
}
