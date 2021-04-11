import React from 'react';
import classnames from 'classnames';
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
          className={classnames('bg-purple-900')}
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
