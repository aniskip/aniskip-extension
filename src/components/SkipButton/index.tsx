import React from 'react';

import { SkipButtonContainerProps } from '../../types/components/skip_time_button_types';
import isInInterval from '../../utils/time_utils';
import Button from './Button';

const SkipButtonContainer = ({
  skipTimes,
  currentTime,
  videoDuration,
  variant,
  onClickHandlers,
}: SkipButtonContainerProps) => (
  <>
    {skipTimes.map(
      (
        {
          interval,
          episode_length: episodeLength,
          skip_id: skipId,
          skip_type: skipType,
        },
        index
      ) => {
        const { start_time: startTime, end_time: endTime } = interval;
        const offset = videoDuration - episodeLength;

        const inInterval = isInInterval(
          startTime + offset,
          currentTime,
          0,
          endTime - startTime
        );

        return (
          <Button
            key={`skip-button-${skipId}`}
            skipType={skipType}
            variant={variant}
            hidden={!inInterval}
            onClick={onClickHandlers[index]}
          />
        );
      }
    )}
  </>
);

export default SkipButtonContainer;
