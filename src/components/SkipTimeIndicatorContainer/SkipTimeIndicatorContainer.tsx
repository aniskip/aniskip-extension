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
        const isPreview = skipTime.skipType === 'preview';
        if (isPreview) {
          return null;
        }

        const { startTime: startTime, endTime: endTime } = skipTime.interval;
        const { episodeLength: episodeLength } = skipTime;
        const offset = videoDuration - skipTime.episodeLength;

        return (
          <SkipTimeIndicator
            className="bg-blue-700"
            startTime={startTime + offset}
            endTime={endTime + offset}
            episodeLength={episodeLength + offset}
            key={`skip-time-indicator-${skipTime.skipId}`}
            variant={variant}
          />
        );
      })}
    </>
  );
};
