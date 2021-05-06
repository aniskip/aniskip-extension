import React from 'react';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicator from './SkipTimeIndicator';

const SkipTimeIndicatorContainer: React.FC<SkipTimeIndicatorContainerProps> = ({
  skipTimes,
  offset,
  variant,
}: SkipTimeIndicatorContainerProps) => (
  <div>
    {skipTimes.map((skipTime) => {
      const { start_time: startTime, end_time: endTime } = skipTime.interval;
      const { episode_length: episodeLength } = skipTime;

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
  </div>
);
export default SkipTimeIndicatorContainer;
