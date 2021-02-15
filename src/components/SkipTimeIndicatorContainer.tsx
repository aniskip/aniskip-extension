import React from 'react';
import classnames from 'classnames';
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
          className={classnames('bg-green-700')}
          startTime={startTime}
          endTime={endTime}
          episodeLength={episodeLength}
          key={skipTime.skip_id}
        />
      );
    })}
  </div>
);
export default SkipTimeIndicatorContainer;
