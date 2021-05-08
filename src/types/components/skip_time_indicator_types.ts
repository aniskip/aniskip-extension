import { SkipTimeType } from '../api/skip_time_types';

export interface SkipTimeIndicatorProps {
  startTime: number;
  endTime: number;
  episodeLength: number;
  className?: string;
  variant: string;
}

export interface SkipTimeIndicatorContainerProps {
  skipTimes: SkipTimeType[];
  videoDuration: number;
  variant: string;
}
