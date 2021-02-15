import React from 'react';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicator from './SkipTimeIndicator';

const SkipTimeIndicatorContainer: React.FC<SkipTimeIndicatorContainerProps> = ({
  skipTimes,
}: SkipTimeIndicatorContainerProps) => (
  <div>
    {skipTimes.map((skipTime) => {
      const { start_time: startTime, end_time: endTime } = skipTime.interval;
      const { episode_length: episodeLength } = skipTime;

      return (
        <SkipTimeIndicator
          startTime={startTime}
          endTime={endTime}
          episodeLength={episodeLength}
          color="red"
          key={skipTime.skip_id}
        />
      );
    })}
  </div>
);
export default SkipTimeIndicatorContainer;
