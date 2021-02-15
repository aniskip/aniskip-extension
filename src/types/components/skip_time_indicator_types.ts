import { SkipTime } from '../api/skip_time_types';

export interface SkipTimeIndicatorProps {
  startTime: number;
  endTime: number;
  episodeLength: number;
  className: string;
}

export interface SkipTimeIndicatorContainerProps {
  skipTimes: SkipTime[];
}
