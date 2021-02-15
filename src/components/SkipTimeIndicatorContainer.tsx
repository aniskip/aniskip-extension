import React from 'react';
import classnames from 'classnames';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicator from './SkipTimeIndicator';

const SkipTimeIndicatorContainer: React.FC<SkipTimeIndicatorContainerProps> = ({
  skipTimes,
  variant,
}: SkipTimeIndicatorContainerProps) => (
  <div className={classnames('w-full', 'h-full')}>
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
          variant={variant}
        />
      );
    })}
  </div>
);
export default SkipTimeIndicatorContainer;
