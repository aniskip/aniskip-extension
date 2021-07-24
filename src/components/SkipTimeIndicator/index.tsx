import React from 'react';

import { SkipTimeIndicatorContainerProps } from './SkipTimeIndicator.types';
import { Indicator } from './Indicator';

export const SkipTimeIndicatorContainer = ({
  skipTimes,
  videoDuration,
  variant,
}: SkipTimeIndicatorContainerProps): JSX.Element => (
  <>
    {skipTimes.map((skipTime) => {
      const { start_time: startTime, end_time: endTime } = skipTime.interval;
      const { episode_length: episodeLength } = skipTime;
      const offset = videoDuration - skipTime.episode_length;

      return (
        <Indicator
          className="bg-blue-700"
          startTime={startTime + offset}
          endTime={endTime + offset}
          episodeLength={episodeLength + offset}
          key={`skip-time-indicator-${skipTime.skip_id}`}
          variant={variant}
        />
      );
    })}
  </>
);
