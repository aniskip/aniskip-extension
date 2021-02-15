import { SkipTime } from '../api/skip_time_types';

export interface SkipTimeIndicatorProps {
  startTime: number;
  endTime: number;
  episodeLength: number;
  color: string;
}

export interface SkipTimeIndicatorContainerProps {
  skipTimes: SkipTime[];
}
