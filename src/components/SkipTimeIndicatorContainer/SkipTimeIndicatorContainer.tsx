import React from 'react';
import { selectSkipTimes } from '../../data';
import { useSelector } from '../../hooks';
import { usePlayerRef } from '../../utils';
import { SkipTimeIndicator } from '../SkipTimeIndicator';
import { SkipTimeIndicatorContainerProps } from './SkipTimeIndicatorContainer.types';

export const SkipTimeIndicatorContainer = ({
  variant,
}: SkipTimeIndicatorContainerProps): JSX.Element => {
  const skipTimes = useSelector(selectSkipTimes);
  const player = usePlayerRef();
  const videoDuration = player?.getDuration() ?? 0;

  return (
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
            key={`skip-time-indicator-${skipTime.skip_id}`}
            variant={variant}
          />
        );
      })}
    </>
  );
};
