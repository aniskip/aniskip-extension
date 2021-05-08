import React from 'react';

import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicator from './SkipTimeIndicator';

const SkipTimeIndicatorContainer: React.FC<SkipTimeIndicatorContainerProps> = ({
  skipTimes,
  videoDuration,
  variant,
}: SkipTimeIndicatorContainerProps) => (
  <>
    {skipTimes.map((skipTime) => {
      const { start_time: startTime, end_time: endTime } = skipTime.interval;
      const { episode_length: episodeLength } = skipTime;
      const offset = videoDuration - skipTime.episode_length;

      return (
        <SkipTimeIndicator
          className="bg-blue-700"
          startTime={startTime + offset}
          endTime={endTime + offset}
          episodeLength={episodeLength + offset}
          key={skipTime.skip_id}
          variant={variant}
        />
      );
    })}
  </>
);
export default SkipTimeIndicatorContainer;
